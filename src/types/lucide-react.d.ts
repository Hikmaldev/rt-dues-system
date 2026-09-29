declare module 'lucide-react' {
  import * as React from 'react';
  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
  }
  export type LucideIcon = React.ForwardRefExoticComponent<
    LucideProps & React.RefAttributes<SVGSVGElement>
  >;

  export const LayoutDashboard: LucideIcon;
  export const Users: LucideIcon;
  export const ReceiptText: LucideIcon;
  export const Receipt: LucideIcon;
  export const FileSpreadsheet: LucideIcon;
  export const FileText: LucideIcon;
  export const PieChart: LucideIcon;
  export const ShieldAlert: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const Shield: LucideIcon;
  export const Search: LucideIcon;
  export const LogOut: LucideIcon;
  export const X: LucideIcon;
  export const HelpCircle: LucideIcon;
  export const Menu: LucideIcon;
  export const Bell: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const Home: LucideIcon;
  export const Plus: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const MoreVertical: LucideIcon;
  export const Calendar: LucideIcon;
  export const Copy: LucideIcon;
  export const Check: LucideIcon;
  export const Building: LucideIcon;
  export const Filter: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const Edit2: LucideIcon;
  export const Trash2: LucideIcon;
  export const XCircle: LucideIcon;
  export const CreditCard: LucideIcon;
  export const FileCheck: LucideIcon;
  export const Upload: LucideIcon;
  export const Clock: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Lock: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const Zap: LucideIcon;
  export const Mail: LucideIcon;
  export const Key: LucideIcon;
  export const Printer: LucideIcon;
  export const Download: LucideIcon;

  const icons: { [key: string]: LucideIcon };
  export default icons;
}
