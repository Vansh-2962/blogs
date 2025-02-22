import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <main className="grid place-content-center h-screen">
        <SignIn />
      </main>
    </>
  );
}
