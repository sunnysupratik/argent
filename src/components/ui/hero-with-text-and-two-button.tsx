import { MoveRight, PhoneCall } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { InteractiveHoverButton } from "./interactive-hover-button";

function Hero1() {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div>
            <InteractiveHoverButton 
              variant="white" 
              text="Read our launch article" 
              icon={<MoveRight className="w-4 h-4" />}
              className="text-sm px-6 py-2"
            />
          </div>
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
              <div className="text-text-primary">Financial</div>
              <div className="text-text-primary">Clarity.</div>
              <div className="bg-gradient-to-r from-accent-blue to-blue-600 bg-clip-text text-transparent">
                Simplified.
              </div>
            </h1>
            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
              Take control of your financial future with precision-engineered tools designed for the modern investor.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <InteractiveHoverButton 
              variant="white" 
              text="Jump on a call" 
              icon={<PhoneCall className="w-4 h-4" />}
              onClick={() => navigate('/login')}
              className="px-8 py-3"
            />
            <InteractiveHoverButton 
              variant="blue" 
              text="Sign up here" 
              icon={<MoveRight className="w-4 h-4" />}
              onClick={() => navigate('/login')}
              className="px-8 py-3"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero1 };