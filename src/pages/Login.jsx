import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const dancers = Array.from({ length: 8 }, (_, i) => ({
      x: (window.innerWidth / 9) * (i + 1),
      y: window.innerHeight - 150,
      phase: i * 0.8,
      speed: 0.05 + Math.random() * 0.03,
      color: ['#e04472', '#aa00ff', '#ff6600', '#00ffcc',
              '#ff0066', '#ffcc00', '#00aaff', '#ff44aa'][i],
      size: 0.8 + Math.random() * 0.4,
    }));

    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 1 + Math.random() * 3,
      color: ['#e04472', '#aa00ff', '#ff6600', '#00ffcc', '#ffcc00'][
        Math.floor(Math.random() * 5)
      ],
      speedY: -0.5 - Math.random() * 1,
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: Math.random(),
    }));

    const beams = Array.from({ length: 6 }, (_, i) => ({
      x: (window.innerWidth / 7) * (i + 1),
      angle: -0.3 + i * 0.1,
      color: ['#e0447230', '#aa00ff30', '#ff660030',
              '#00ffcc30', '#ff006630', '#ffcc0030'][i],
      speed: 0.02,
      dir: i % 2 === 0 ? 1 : -1,
    }));

    let animFrame;
    let time = 0;

    const drawPerson = (ctx, x, y, phase, color, size) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(size, size);
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      const bob = Math.sin(phase) * 8;
      const armSwing = Math.sin(phase) * 0.6;
      ctx.shadowColor = color;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(0, -60 + bob, 10, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, -50 + bob);
      ctx.lineTo(0, -20 + bob);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -40 + bob);
      ctx.lineTo(-20 * Math.cos(armSwing), -40 + bob - 20 * Math.sin(armSwing));
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -40 + bob);
      ctx.lineTo(20 * Math.cos(armSwing), -40 + bob + 20 * Math.sin(armSwing));
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -20 + bob);
      ctx.lineTo(-15, 10 + Math.sin(phase + 1) * 10);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -20 + bob);
      ctx.lineTo(15, 10 + Math.sin(phase) * 10);
      ctx.stroke();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      bg.addColorStop(0, '#050008');
      bg.addColorStop(0.5, '#0d0015');
      bg.addColorStop(1, '#080010');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      beams.forEach(beam => {
        beam.angle += beam.speed * beam.dir;
        if (Math.abs(beam.angle) > 0.5) beam.dir *= -1;
        ctx.save();
        ctx.translate(beam.x, 0);
        ctx.rotate(beam.angle);
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.8);
        grad.addColorStop(0, beam.color.replace('30', '60'));
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(-20, 0);
        ctx.lineTo(20, 0);
        ctx.lineTo(80, canvas.height * 0.8);
        ctx.lineTo(-80, canvas.height * 0.8);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      const discoX = canvas.width / 2;
      const discoY = 60;
      ctx.save();
      ctx.translate(discoX, discoY);
      const discoGrad = ctx.createRadialGradient(-8, -8, 2, 0, 0, 25);
      discoGrad.addColorStop(0, '#ffffff');
      discoGrad.addColorStop(0.5, '#aaaaaa');
      discoGrad.addColorStop(1, '#444444');
      ctx.fillStyle = discoGrad;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 20 + Math.sin(time * 2) * 10;
      ctx.beginPath();
      ctx.arc(0, 0, 25, 0, Math.PI * 2);
      ctx.fill();
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + time;
        const rx = Math.cos(angle) * (80 + Math.sin(time * 3) * 30);
        const ry = Math.sin(angle) * (60 + Math.cos(time * 2) * 20);
        ctx.beginPath();
        ctx.arc(rx, ry + 100, 4, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${(i * 30 + time * 50) % 360}, 100%, 70%, 0.6)`;
        ctx.shadowColor = `hsla(${(i * 30 + time * 50) % 360}, 100%, 70%, 1)`;
        ctx.shadowBlur = 10;
        ctx.fill();
      }
      ctx.restore();

      const floorY = canvas.height - 100;
      const floorGrad = ctx.createLinearGradient(0, floorY, 0, canvas.height);
      floorGrad.addColorStop(0, '#1a003040');
      floorGrad.addColorStop(1, '#2a005060');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, floorY, canvas.width, 100);
      for (let i = 0; i < 20; i++) {
        const tileX = (canvas.width / 20) * i;
        const glow = Math.sin(time * 3 + i) > 0.7;
        ctx.fillStyle = glow
          ? `hsla(${(i * 18 + time * 30) % 360}, 100%, 50%, 0.15)`
          : 'rgba(255,255,255,0.02)';
        ctx.fillRect(tileX, floorY, canvas.width / 20 - 1, 100);
      }

      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity -= 0.003;
        if (p.y < 0 || p.opacity <= 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
          p.opacity = Math.random();
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });

      dancers.forEach(d => {
        d.phase += d.speed;
        drawPerson(ctx, d.x, d.y, d.phase, d.color, d.size);
      });

      ctx.font = '20px Arial';
      ctx.fillStyle = `rgba(224, 68, 114, ${0.3 + Math.sin(time * 2) * 0.2})`;
      ctx.fillText('♪', 50 + Math.sin(time) * 20, 200 + Math.cos(time) * 30);
      ctx.fillText('♫', canvas.width - 80 + Math.cos(time) * 20, 250 + Math.sin(time) * 30);
      ctx.fillText('♩', 100 + Math.cos(time * 1.5) * 15, 350 + Math.sin(time) * 20);
      ctx.fillText('♬', canvas.width - 120 + Math.sin(time * 1.5) * 15, 180 + Math.cos(time) * 20);

      time += 0.03;
      animFrame = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

 // In Login.jsx handleSubmit
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  try {
    const res = await axios.post('/auth/login', { email, password });
    const data = res.data;
    localStorage.setItem('customer', JSON.stringify({
      id: data.userId,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    }));
    const redirectTo = localStorage.getItem('redirectAfterLogin');
    localStorage.removeItem('redirectAfterLogin');
    navigate(redirectTo || '/');
  } catch (err) {
    setError('Invalid email or password.');
  } finally {
    setLoading(false);
  }
};
  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%', zIndex: 0,
      }} />

      <div style={{
        position: 'relative', zIndex: 10,
        minHeight: '100vh',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '20px',
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '64px', lineHeight: 1 }}>🍷</div>
            <h1 style={{
              color: 'white', fontSize: '32px', fontWeight: 'bold',
              margin: '8px 0 4px',
              textShadow: '0 0 30px #e04472',
            }}>
              Wine Shop
            </h1>
            <p style={{ color: '#e04472', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase' }}>
              Sign in to continue
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: 'rgba(10, 0, 20, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(224, 68, 114, 0.3)',
            borderRadius: '20px', padding: '36px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 40px rgba(224,68,114,0.15)',
          }}>
            <h2 style={{
              color: 'white', fontSize: '20px',
              fontWeight: '600', marginBottom: '24px', textAlign: 'center',
            }}>
              Welcome Back 🎉
            </h2>

            {error && (
              <div style={{
                background: 'rgba(220,38,38,0.2)',
                border: '1px solid rgba(220,38,38,0.5)',
                color: '#fca5a5', padding: '12px 16px',
                borderRadius: '10px', marginBottom: '16px', fontSize: '14px',
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                  Email
                </label>
                <input
                  type="email" placeholder="your@email.com"
                  value={email} onChange={e => setEmail(e.target.value)} required
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px', padding: '12px 16px',
                    color: 'white', outline: 'none', fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                  Password
                </label>
                <input
                  type="password" placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} required
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px', padding: '12px 16px',
                    color: 'white', outline: 'none', fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '14px',
                background: loading
                  ? 'rgba(224,68,114,0.5)'
                  : 'linear-gradient(135deg, #e04472, #aa00ff)',
                border: 'none', borderRadius: '10px',
                color: 'white', fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                boxShadow: '0 4px 20px rgba(224,68,114,0.4)',
                transition: 'all 0.3s',
              }}>
                {loading ? 'Signing in...' : '🎉 Sign In'}
              </button>
            </form>

            {/* Register Link for Customers */}
            <div style={{
              borderTop: '1px solid rgba(255,255,255,0.08)',
              marginTop: '24px', paddingTop: '24px',
              textAlign: 'center',
            }}>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                New customer?{' '}
                <span
                  onClick={() => navigate('/register')}
                  style={{ color: '#e04472', cursor: 'pointer', fontWeight: '500' }}
                >
                  Create account
                </span>
              </p>
            </div>
          </div>

          <p style={{
            textAlign: 'center', color: '#4b5563',
            fontSize: '12px', marginTop: '16px',
          }}>
            Wine Shop Management System © 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;