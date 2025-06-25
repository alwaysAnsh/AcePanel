import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import './globals.css'
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="mt-20">
      <SignedOut>
              
                <SignInButton>
                  <Button>
                    Login
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button>
                    Signup
                  </Button>
                </SignUpButton>
              
              
                
              
        </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
    </div>
  );
}
