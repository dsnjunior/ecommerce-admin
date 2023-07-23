interface CustomerDetailProps {
  label: string;
  value: string;
}

export const CustomerDetail = ({ label, value }: CustomerDetailProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
};
