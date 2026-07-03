import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  title: string;
  description?: string;
  breadcrumbs: Crumb[];
  action?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  breadcrumbs,
  action,
}: Props) {
  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => (
            <div
              key={crumb.label}
              className="flex items-center"
            >
              <BreadcrumbItem>
                {crumb.href ? (
                  <BreadcrumbLink href={crumb.href}>
                    {crumb.label}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>
                    {crumb.label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>

              {index !== breadcrumbs.length - 1 && (
                <BreadcrumbSeparator />
              )}
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {title}
          </h1>

          {description && (
            <p className="text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>

        {action}
      </div>
    </div>
  );
}