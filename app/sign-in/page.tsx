import type { Metadata } from "next";
import AuthForm from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "Sign in — Gleynr" };

const Page = () => <AuthForm />;

export default Page;
