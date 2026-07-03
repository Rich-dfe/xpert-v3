import { auth, signIn } from "@/auth";

export default async function Home() {
  const session = await auth();
  return (
    <main>
      <h1>Home</h1>

      {session ? (
        <pre>{JSON.stringify(session, null, 2)}</pre>
      ) : (
        <form
          action={async () => {
            "use server";
            await signIn("cognito");
          }}
        >
          <button className="bg-green-500 p-2 rounded-sm" type="submit">Sign In</button>
        </form>
      )}
    </main>
  );
}
