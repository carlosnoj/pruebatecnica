//import api from "./api";
import { jwtDecode } from "jwt-decode";

// export async function login(email, password) {
//   // Supongamos que LoopBack entrega un acceso en /users/login o /auth/login
//   // Ajusta según tu API LoopBack
//   try {
//     const res = await api.post("/usuarios/login", { email, password });
//     console.log("respuesta del backend desde auth: ", res.data);
//     const token =
//       res.data.id || res.data.token || res.data.accessToken || res.data.token;
//     // Algunos LoopBack devuelven { id: '<token>', userId: ... }
//     return token;
//   } catch (error) {
//     console.error("Error en login: ", error.res?.data || error.error);
//   }
// }

export function decodeToken(token) {
  try {
    const decoded = jwtDecode(token);
    console.log("Token decodificado:", decoded);
    return decoded;
  } catch (e) {
    console.error("Error al decodificar token:", e);
    return null;
  }
}
