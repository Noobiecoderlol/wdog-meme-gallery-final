interface SignConfig {
  id: string;
  name: string;
  text: string;
  emoji: string;
  color: string;
  fontSize: number;
  shadowBlur?: number;
}

export const SIGNS: SignConfig[] = [
  {
    id: 'sign-1',
    name: 'TO THE MOON',
    text: 'TO THE MOON',
    emoji: '🚀',
    color: '#00FFFF',
    fontSize: 48
  },
  {
    id: 'sign-2',
    name: 'HODL',
    text: 'HODL',
    emoji: '💎',
    color: '#89CFF0',
    fontSize: 54
  },
  {
    id: 'sign-3',
    name: 'WAGMI',
    text: 'WAGMI',
    emoji: '⭐',
    color: '#39FF14',
    fontSize: 52
  },
  {
    id: 'sign-4',
    name: 'GM FRENS',
    text: 'GM FRENS',
    emoji: '☀️',
    color: '#FFA500',
    fontSize: 46
  },
  {
    id: 'sign-5',
    name: 'WOOF WOOF',
    text: 'WOOF WOOF',
    emoji: '🐕',
    color: '#FF69B4',
    fontSize: 46
  },
  {
    id: 'sign-6',
    name: 'DEGEN',
    text: 'DEGEN',
    emoji: '🎲',
    color: '#B026FF',
    fontSize: 54
  },
  {
    id: 'sign-7',
    name: 'APE IN',
    text: 'APE IN',
    emoji: '🦍',
    color: '#FF8C00',
    fontSize: 54
  },
  {
    id: 'sign-8',
    name: 'NGMI',
    text: 'NGMI',
    emoji: '💀',
    color: '#FF0000',
    fontSize: 54
  },
  {
    id: 'sign-9',
    name: 'ALPHA',
    text: 'ALPHA',
    emoji: '🔥',
    color: '#FFD700',
    fontSize: 54
  },
  {
    id: 'sign-10',
    name: 'SER',
    text: 'SER',
    emoji: '🫡',
    color: '#87CEEB',
    fontSize: 54
  },
  {
    id: 'sign-11',
    name: 'LFG',
    text: 'LFG',
    emoji: '🚀',
    color: '#FF00FF',
    fontSize: 54
  },
  {
    id: 'sign-12',
    name: 'FREN',
    text: 'FREN',
    emoji: '🤝',
    color: '#40E0D0',
    fontSize: 54
  },
  {
    id: 'sign-13',
    name: 'BASED',
    text: 'BASED',
    emoji: '⚡',
    color: '#32CD32',
    fontSize: 54
  },
  {
    id: 'sign-14',
    name: 'GG',
    text: 'GG',
    emoji: '🎮',
    color: '#8A2BE2',
    fontSize: 54
  },
  {
    id: 'sign-15',
    name: 'SOON™',
    text: 'SOON™',
    emoji: '⏰',
    color: '#FFFFFF',
    fontSize: 52,
    shadowBlur: 40
  }
];

export const renderSign = (
  ctx: CanvasRenderingContext2D, 
  sign: SignConfig,
  x: number,
  y: number,
  scale: number = 1
) => {
  ctx.save();
  
  // Applicera position och skala
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Rita neon border med transparent bakgrund
  ctx.strokeStyle = sign.color;
  ctx.lineWidth = 2;
  ctx.shadowColor = sign.color;
  ctx.shadowBlur = sign.shadowBlur || 30;
  ctx.beginPath();
  ctx.roundRect(-200, -100, 400, 200, 12);
  ctx.stroke();

  // Rita text
  ctx.shadowBlur = sign.shadowBlur ? sign.shadowBlur / 2 : 15;
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${sign.fontSize}px Orbitron, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(sign.text, 0, 0);

  // Rita emoji
  ctx.font = '72px sans-serif';
  ctx.fillText(sign.emoji, 0, 60);

  ctx.restore();
};

// Funktion för att skapa thumbnail
export const createThumbnail = (sign: SignConfig): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Rendera skylten i mindre storlek för thumbnail
  renderSign(ctx, sign, 50, 50, 0.25);
  
  return canvas.toDataURL('image/webp');
}; 