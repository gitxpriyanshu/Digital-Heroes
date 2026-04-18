import { getServiceRoleClient } from '@/lib/supabase-server';
import { generateRandomDraw, generateAlgorithmicDraw, calculateWinners, calculatePrizes } from '@/lib/draw-engine';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { drawId } = await req.json();
  const supabase = getServiceRoleClient();

  // 1. Get draw config
  const { data: draw, error: drawError } = await supabase
    .from('draws')
    .select('*')
    .eq('id', drawId)
    .single();

  if (drawError) return NextResponse.json({ error: drawError.message }, { status: 500 });

  // 2. Generate Winning Numbers
  let winningNumbers: number[] = [];
  if (draw.draw_logic === 'random') {
    winningNumbers = generateRandomDraw();
  } else {
    const { data: allScores } = await supabase.from('scores').select('score');
    winningNumbers = generateAlgorithmicDraw(allScores?.map(s => s.score) || []);
  }

  // 3. Calculate Winners
  const winners = await calculateWinners(winningNumbers);

  // 4. Calculate Prizes (Assuming a mock split for simulation)
  const prizes = calculatePrizes(
    { five: draw.prize_pool_total * 0.4, four: draw.prize_pool_total * 0.35, three: draw.prize_pool_total * 0.25 },
    winners
  );

  return NextResponse.json({
    winningNumbers,
    winners,
    prizes,
    simulatedAt: new Date().toISOString()
  });
}
