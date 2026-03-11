// Ejemplo de código bien escrito
// El agente debería aprobar este código

import { z } from 'zod';

// Validación de entrada con Zod
const UserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  age: z.number().min(18).optional(),
});

// Uso de prepared statements para prevenir SQL injection
async function getUserByEmail(email: string) {
  try {
    const validatedEmail = z.string().email().parse(email);
    const query = 'SELECT * FROM users WHERE email = ?';
    const result = await db.execute(query, [validatedEmail]);
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Failed to fetch user');
  }
}

// Manejo apropiado de null/undefined
function processUser(user: { name: string } | null): string {
  if (!user || !user.name) {
    throw new Error('Invalid user object');
  }
  return user.name.toUpperCase();
}

// Configuración segura usando variables de entorno
const config = {
  apiKey: process.env.API_KEY,
  apiEndpoint: process.env.API_ENDPOINT,
};

if (!config.apiKey || !config.apiEndpoint) {
  throw new Error('Missing required environment variables');
}

// Manejo robusto de errores en async
async function fetchData(url: string) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// Función refactorizada y modular
interface PriceCalculation {
  basePrice: number;
  discount?: { type: 'percentage' | 'fixed'; value: number };
  taxRate?: number;
  shipping?: { express: boolean };
  coupon?: { value: number };
  membership?: { level: 'premium' | 'standard' };
}

function calculatePrice(params: PriceCalculation): number {
  let price = params.basePrice;
  
  price = applyDiscount(price, params.discount);
  price = applyTax(price, params.taxRate);
  price = addShipping(price, params.shipping);
  price = applyCoupon(price, params.coupon);
  price = applyMembershipDiscount(price, params.membership);
  
  return Math.max(0, price); // Asegurar que el precio no sea negativo
}

function applyDiscount(
  price: number,
  discount?: { type: 'percentage' | 'fixed'; value: number }
): number {
  if (!discount) return price;
  
  if (discount.type === 'percentage') {
    return price * (1 - discount.value / 100);
  }
  return price - discount.value;
}

function applyTax(price: number, taxRate?: number): number {
  return taxRate ? price * (1 + taxRate) : price;
}

function addShipping(price: number, shipping?: { express: boolean }): number {
  if (!shipping) return price;
  return price + (shipping.express ? 20 : 5);
}

function applyCoupon(price: number, coupon?: { value: number }): number {
  return coupon ? price - coupon.value : price;
}

function applyMembershipDiscount(
  price: number,
  membership?: { level: string }
): number {
  return membership?.level === 'premium' ? price * 0.9 : price;
}

// Thread-safe counter usando atomic operations
class SafeCounter {
  private counter = 0;
  private lock = Promise.resolve();

  async increment(): Promise<number> {
    this.lock = this.lock.then(async () => {
      this.counter++;
      return this.counter;
    });
    return this.lock;
  }

  getCount(): number {
    return this.counter;
  }
}

// Validación completa de entrada
async function createUser(userData: unknown) {
  try {
    const validatedData = UserSchema.parse(userData);
    return await database.insert('users', validatedData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.message}`);
    }
    throw error;
  }
}

// DRY - función genérica reutilizable
async function getUserByField<T>(
  field: string,
  value: T
): Promise<any | null> {
  const allowedFields = ['id', 'username', 'email'];
  
  if (!allowedFields.includes(field)) {
    throw new Error(`Invalid field: ${field}`);
  }
  
  const query = `SELECT * FROM users WHERE ${field} = ?`;
  const result = await db.execute(query, [value]);
  return result[0] || null;
}

export {
  getUserByEmail,
  processUser,
  fetchData,
  calculatePrice,
  SafeCounter,
  createUser,
  getUserByField,
};
