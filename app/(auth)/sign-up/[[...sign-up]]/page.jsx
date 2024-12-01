import { SignUp } from "@clerk/nextjs";
 
export default function Page() {
  return (
    <div className=" mt-20 flex items-center justify-center">
      <SignUp />
    </div>
  );
}