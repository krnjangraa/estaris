import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren, useState } from "react";
import { Toaster } from "sonner";

export default function Providers({
  children,
}: PropsWithChildren) {
  const [queryClient] = useState(
    () => new QueryClient()
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      <Toaster
        richColors
        position="top-right"
      />

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}