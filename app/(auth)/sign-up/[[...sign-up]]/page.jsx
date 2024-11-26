import { SignUp } from "@clerk/nextjs";
 
export default function Page() {
  return (
    <div className="y-25 flex items-center justify-center">
      <SignUp />
    </div>
  );
}