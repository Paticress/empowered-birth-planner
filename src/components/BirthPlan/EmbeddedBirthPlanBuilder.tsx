
import { BirthPlanBuilder } from './BirthPlanBuilder';

export function EmbeddedBirthPlanBuilder() {
  return (
    // Passing embedded=true to indicate this is being used in an iframe/embedded context
    <BirthPlanBuilder embedded={true} />
  );
}
