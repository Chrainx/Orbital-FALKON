import { AuthProvider } from "../contexts/auth";
import { Slot } from "expo-router";

export default function Root() {
  return (
  <AuthProvider>
    <Slot />
  </AuthProvider>
  );
}