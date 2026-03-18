export const calculateGravityForce = (mass1: number, mass2: number, distance: number) => {
  const G = 6.674e-11;
  if (distance === 0) return 0;
  return (G * mass1 * mass2) / (distance * distance);
};

export const getOrbitalVelocity = (mass: number, radius: number) => {
  const G = 6.674e-11;
  if (radius === 0) return 0;
  return Math.sqrt((G * mass) / radius);
};

export const getRiskPhysics = (score: number) => {
  if (score < 30) return { force: 'repel', color: '#10B981', mass: 5 }; // Safe
  if (score < 70) return { force: 'orbit', color: '#F59E0B', mass: 10 }; // Warning
  return { force: 'collapse', color: '#EF4444', mass: 20 }; // Danger
};
