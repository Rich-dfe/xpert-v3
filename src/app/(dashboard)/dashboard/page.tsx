import { auth, signIn } from "@/auth";
import { FormCard } from "@/components/forms/FormCard";
import LoggerMapLoader from "@/components/LoggerMapLoader";
import LatestLoggerInfo from "@/components/LatestLoggerInfo";

export default async function Home() {

  const session = await auth();
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <FormCard
        title="Map"
        description="Configure the main logger settings."
      >
      <LoggerMapLoader />
      </FormCard>
      
      <FormCard
        title="ID Token"
        description="The JWT ID Token."
      >
        {session ? (
        <pre className="whitespace-pre-wrap break-all text-sm ">{JSON.stringify(session, null, 2)}</pre>
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
      </FormCard>
      <FormCard 
        title="Latest Logger Information"
        >
          <LatestLoggerInfo />
      </FormCard>
    </div>
  );
}