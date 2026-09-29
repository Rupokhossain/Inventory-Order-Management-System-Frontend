import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // কুকি থেকে টোকেন এবং রোল পড়া
  const token = request.cookies.get("accessToken")?.value;
  const role = request.cookies.get("userRole")?.value;

  const isAdminRoute = pathname.startsWith("/admin");
  const isManagerRoute = pathname.startsWith("/manager");
  const isCustomerRoute = pathname.startsWith("/dashboard");

  // ১. লগইন ছাড়া কেউ প্রোটেক্টেড ড্যাশবোর্ডে ঢুকতে চাইলে লগইন পেজে পাঠানো
  if ((isAdminRoute || isManagerRoute || isCustomerRoute) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ২. রোল ভেরিফিকেশন: অ্যাডমিন পেজে শুধুমাত্র ADMIN ঢুকতে পারবে
  if (isAdminRoute && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard/orders", request.url));
  }

  // ৩. রোল ভেরিফিকেশন: ম্যানেজার পেজে ADMIN অথবা MANAGER ঢুকতে পারবে
  if (isManagerRoute && role !== "ADMIN" && role !== "MANAGER") {
    return NextResponse.redirect(new URL("/dashboard/orders", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/manager/:path*",
    "/dashboard/:path*",
  ],
};