import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center px-4" data-testid="page-not-found">
      <Card className="surface-glass rounded-2xl p-8 max-w-lg w-full text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 ring-1 ring-border">
          <FileX className="h-5 w-5 text-primary" />
        </div>
        <h1 className="mt-4 text-2xl">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you’re looking for doesn’t exist. Head back to the inbox.
        </p>
        <div className="mt-6 flex justify-center">
          <Button asChild className="rounded-xl" data-testid="not-found-go-inbox">
            <Link href="/inbox">Go to Inbox</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
