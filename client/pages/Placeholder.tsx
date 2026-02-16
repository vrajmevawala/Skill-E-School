import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "react-router-dom";
import { Construction, ArrowLeft } from "lucide-react";

export default function PlaceholderPage() {
  const location = useLocation();
  const pageName = location.pathname.substring(1).split('/').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return (
    <div className="container py-20 flex flex-col items-center justify-center text-center min-h-[60vh]">
      <div className="bg-primary/10 p-6 rounded-full mb-8">
        <Construction className="h-16 w-16 text-primary animate-pulse" />
      </div>
      <h1 className="text-4xl font-bold mb-4">{pageName || "Coming Soon"}</h1>
      <p className="text-xl text-muted-foreground max-w-2xl mb-8">
        We're currently building the <strong>{pageName}</strong> module. This section will include comprehensive tools and dashboards specifically designed for our users.
      </p>
      <Card className="w-full max-w-md border-dashed">
        <CardHeader>
          <CardTitle>Want to see this page?</CardTitle>
          <CardDescription>
            Ask Fusion to continue building the specific features for this section!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button asChild className="w-full">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Homepage
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
