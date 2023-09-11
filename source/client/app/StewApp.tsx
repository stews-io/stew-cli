import { BuildStewConfig } from "../../shared/types/StewConfig.ts";

export interface StewAppProps {
  stewConfig: BuildStewConfig;
}

export function StewApp(props: StewAppProps) {
  const { stewConfig } = props;
  return <div>loaded</div>;
}
