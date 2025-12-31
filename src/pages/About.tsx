import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";

export default function About() {
  return (
    <>
      <Helmet>
        <title>About | ZakatFlow</title>
        <meta
          name="description"
          content="Islam is beautiful, and our worship deserves perfection. Learn about ZakatFlow's mission and values."
        />
        <link rel="canonical" href="https://www.zakatflow.org/about" />
      </Helmet>

      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative">
        {/* Back Button */}
        <Link to="/" className="absolute top-4 left-4">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>

        {/* Quote Container */}
        <StaggerContainer className="text-center max-w-2xl" staggerDelay={0.15}>
          {/* Opening Quote Mark */}
          <StaggerItem variant="fade">
            <span className="text-6xl md:text-7xl font-serif text-tertiary/40 leading-none select-none">"</span>
          </StaggerItem>

          {/* Main Quote - First Part */}
          <StaggerItem variant="slide-up">
            <p className="text-2xl md:text-3xl lg:text-4xl font-serif text-foreground leading-relaxed -mt-8">
              Islam is beautiful,
              <br />
              and our worship deserves perfection.
            </p>
          </StaggerItem>

          {/* Quote - Second Part */}
          <StaggerItem variant="slide-up">
            <p className="text-xl md:text-2xl lg:text-3xl font-serif text-muted-foreground mt-8 leading-relaxed">
              Built with precision for your Akhirah and mine.
            </p>
          </StaggerItem>

          {/* Decorative Divider */}
          <StaggerItem variant="fade">
            <div className="flex items-center justify-center gap-3 my-10">
              <div className="h-px w-12 bg-tertiary/30" />
              <div className="w-2 h-2 rounded-full bg-tertiary/50" />
              <div className="h-px w-12 bg-tertiary/30" />
            </div>
          </StaggerItem>

          {/* Attribution */}
          <StaggerItem variant="fade">
            <footer className="space-y-1">
              <p className="text-lg text-muted-foreground">Crafted with care in California,</p>
              <p className="text-lg">
                by{" "}
                <a
                  href="https://www.vora.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Naheed
                </a>
              </p>
            </footer>
          </StaggerItem>

          {/* Closing Quote Mark */}
          <StaggerItem variant="fade">
            <span className="text-6xl md:text-7xl font-serif text-tertiary/40 leading-none select-none mt-4 inline-block">
              "
            </span>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </>
  );
}
