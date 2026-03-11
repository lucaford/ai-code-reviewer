// Ejemplo de código con problemas intencionales
// El agente debería detectar varios issues aquí

// 🚨 Problema 1: SQL Injection
function getUserByEmail(email) {
  const query = `SELECT * FROM users WHERE email = '${email}'`;
  return db.execute(query);
}

// 🚨 Problema 2: Null pointer exception
function processUser(user) {
  return user.name.toUpperCase(); // ¿Qué pasa si user es null?
}

// ⚠️ Problema 3: API key expuesta
const apiKey = "sk-1234567890abcdef";
const apiEndpoint = "https://api.example.com";

// ⚠️ Problema 4: Manejo de errores pobre
async function fetchData(url) {
  const response = await fetch(url);
  return response.json(); // ¿Y si falla?
}

// 💡 Problema 5: Función muy compleja
function calculatePrice(item, discount, tax, shipping, coupon, membership) {
  let price = item.price;
  if (discount) {
    if (discount.type === 'percentage') {
      price = price - (price * discount.value / 100);
    } else {
      price = price - discount.value;
    }
  }
  if (tax) {
    price = price + (price * tax.rate);
  }
  if (shipping) {
    if (shipping.express) {
      price = price + 20;
    } else {
      price = price + 5;
    }
  }
  if (coupon) {
    price = price - coupon.value;
  }
  if (membership && membership.level === 'premium') {
    price = price * 0.9;
  }
  return price;
}

// 🚨 Problema 6: Race condition
let counter = 0;
async function incrementCounter() {
  const current = counter;
  await someAsyncOperation();
  counter = current + 1; // Múltiples llamadas pueden sobrescribirse
}

// ⚠️ Problema 7: Validación de entrada faltante
function createUser(userData) {
  // No valida que userData tenga los campos requeridos
  return database.insert('users', userData);
}

// 💡 Problema 8: Código duplicado
function getUserById(id) {
  const query = 'SELECT * FROM users WHERE id = ?';
  const result = db.execute(query, [id]);
  if (result.length === 0) {
    return null;
  }
  return result[0];
}

function getUserByUsername(username) {
  const query = 'SELECT * FROM users WHERE username = ?';
  const result = db.execute(query, [username]);
  if (result.length === 0) {
    return null;
  }
  return result[0];
}
