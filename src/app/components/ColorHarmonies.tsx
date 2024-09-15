import { ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../components/ui/collapsible"

interface ColorHarmoniesProps {
  harmonies: {
    name: string;
    colors: string[];
  }[];
}

export function ColorHarmonies({ harmonies }: ColorHarmoniesProps) {
  return (
    <div>
      {harmonies.map((harmony, index) => (
        <Collapsible key={index}>
          <CollapsibleTrigger className="flex items-center">
            <ChevronDown className="mr-2" />
            {harmony.name}
          </CollapsibleTrigger>
          <CollapsibleContent>
            {harmony.colors.map((color, colorIndex) => (
              <div key={colorIndex} style={{backgroundColor: color}} className="w-10 h-10"></div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  )
}