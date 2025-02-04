import { useTheme } from "next-themes"
import { Toaster as SonnerProvider } from "sonner"

type ToasterProps = React.ComponentProps<typeof SonnerProvider>

const Sonner = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <SonnerProvider
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:shadow-lg p-2 bg-white/60 backdrop-blur-lg border-none text-black",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Sonner as Toaster }
