import { getServiceRoleClient } from '@/lib/supabase-server';
import { generateRandomDraw, generateAlgorithmicDraw, calculateWinners, calculatePrizes, handleJackpotRollover } from '@/lib/draw-engine';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { drawId } = await req.json();
  const supabase = getServiceRoleClient();

  // 1. Get draw config
  const { data: draw, error: drawError } = await supabase
    .from('draws')
    .select('*')
    .eq('id', drawId)
    .single();

  if (drawError || draw.status === 'published') {
    return NextResponse.json({ error: 'Draw already published or not found' }, { status: 400 });
  }

  // 2. Finalize Draw Results (Similar to simulation)
  let winningNumbers: number[] = [];
  if (draw.draw_logic === 'random') {
    winningNumbers = generateRandomDraw();
  } else {
    const { data: allScores } = await supabase.from('scores').select('score');
    winningNumbers = generateAlgorithmicDraw(allScores?.map(s => s.score) || []);
  }

  const winners = await calculateWinners(winningNumbers);
  const prizePool = {
    five: draw.prize_pool_total * 0.4,
    four: draw.prize_pool_total * 0.35,
    three: draw.prize_pool_total * 0.25
  };
  const prizes = calculatePrizes(prizePool, winners);

  // 3. Save to draw_results
  await supabase.from('draw_results').insert({
    draw_id: drawId,
    winning_numbers: winningNumbers,
    five_match_winners: winners.fiveMatch,
    four_match_winners: winners.fourMatch,
    three_match_winners: winners.threeMatch
  });

  // 4. Record Winners and Prize Amounts
  const winnerEntries = [
    ...winners.fiveMatch.map(uid => ({ draw_id: drawId, user_id: uid, match_type: '5', prize_amount: prizes.fiveMatchAmount })),
    ...winners.fourMatch.map(uid => ({ draw_id: drawId, user_id: uid, match_type: '4', prize_amount: prizes.fourMatchAmount })),
    ...winners.threeMatch.map(uid => ({ draw_id: drawId, user_id: uid, match_type: '3', prize_amount: prizes.threeMatchAmount })),
  ];

  if (winnerEntries.length > 0) {
    await supabase.from('winners').insert(winnerEntries);
  }

  // 5. Update Draw Status
  await supabase.from('draws').update({ status: 'published' }).eq('id', drawId);

  // 6. TIER 5: Jackpot Rollover logic (Handle if no 5-match)
  if (winners.fiveMatch.length === 0) {
    await handleJackpotRollover(draw.draw_month, prizePool.five);
  }

  // 7. Trigger Emails (Conceptual - logic included)
  // In a real app, this should be a background job
  // 7. Trigger Emails
  for (const win of winnerEntries) {
    try {
      const { data: user } = await supabase
        .from('users')
        .select('email, full_name')
        .eq('id', win.user_id)
        .single();

      if (user?.email) {
        await resend.emails.send({
          from: 'Digital Heroes <no-reply@digital-heroes.com>',
          to: user.email,
          subject: '🎉 You are a Winner!',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded-lg;">
              <h1 style="color: #10b981;">Congratulations ${user.full_name || 'Hero'}!</h1>
              <p style="font-size: 18px;">You've won with a <strong>${win.match_type}-number match</strong> in our latest draw.</p>
              <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; margin: 20px 0; text-align: center;">
                <p style="margin: 0; color: #065f46; font-size: 14px; text-transform: uppercase; font-weight: bold;">Your Prize</p>
                <p style="margin: 0; color: #10b981; font-size: 48px; font-weight: 900;">£${win.prize_amount.toFixed(2)}</p>
              </div>
              <p>Head over to your dashboard to view your winning numbers and claim details.</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
              <p style="color: #666; font-size: 12px;">Digital Heroes — Play Golf. Be a Hero.</p>
            </div>
          `
        });
      }
    } catch (err) {
      console.error(`Email failed for user ID ${win.user_id}:`, err);
    }
  }

  return NextResponse.json({ success: true, winningNumbers, winnerCount: winnerEntries.length });
}
