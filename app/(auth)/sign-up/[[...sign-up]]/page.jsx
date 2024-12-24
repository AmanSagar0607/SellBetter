import { SignUp } from "@clerk/nextjs";
 
export default function Page() {
  return (
    <div className=" py-28 flex items-center justify-center bg-black">
      <SignUp />
    </div>
  );
}