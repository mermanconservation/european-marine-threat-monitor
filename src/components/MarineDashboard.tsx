import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  Waves, 
  Fish, 
  Factory,
  Thermometer,
  Shield,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  BarChart3,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ThreatData {
  id: string;
  type: 'pollution' | 'overfishing' | 'climate' | 'invasive' | 'coastal' | 'acidification';
  severity: 'critical' | 'high' | 'medium' | 'low';
  trend: 'increasing' | 'decreasing' | 'stable';
  impact: number; // 0-100
  affected_species: string[];
  description: string;
  last_updated: string;
}

interface CountryData {
  name: string;
  code: string;
  threats: ThreatData[];
  overall_risk: number;
  marine_protected_areas: number;
  coastline_length: number;
  // Scientific Indices
  ocean_health_index: number; // 0-100 (higher is better)
  wwf_risk_assessment: 'low' | 'medium' | 'high' | 'critical';
  iucn_ecosystem_risk: 'least_concern' | 'near_threatened' | 'vulnerable' | 'endangered' | 'critically_endangered';
  last_assessment: string;
}

const europeanCountries: CountryData[] = [
  // Nordic Countries
  {
    name: "Norway",
    code: "NO",
    threats: [
      {
        id: "no-oil-1",
        type: "pollution",
        severity: "high",
        trend: "stable",
        impact: 75,
        affected_species: ["Arctic Cod", "Seal populations"],
        description: "Oil drilling activities in Arctic waters",
        last_updated: "2024-01-15"
      },
      {
        id: "no-climate-1",
        type: "climate",
        severity: "critical",
        trend: "increasing",
        impact: 85,
        affected_species: ["Polar bears", "Arctic marine life"],
        description: "Rapid ice melting affecting marine ecosystems",
        last_updated: "2024-01-10"
      }
    ],
    overall_risk: 70,
    marine_protected_areas: 15,
    coastline_length: 25148,
    ocean_health_index: 72,
    wwf_risk_assessment: 'high',
    iucn_ecosystem_risk: 'vulnerable',
    last_assessment: "2024-01-15"
  },
  {
    name: "Sweden",
    code: "SE",
    threats: [
      {
        id: "se-algae-1",
        type: "pollution",
        severity: "medium",
        trend: "stable",
        impact: 55,
        affected_species: ["Baltic fish", "Seabirds"],
        description: "Algal blooms in Baltic Sea",
        last_updated: "2024-01-12"
      },
      {
        id: "se-fishing-1",
        type: "overfishing",
        severity: "medium",
        trend: "decreasing",
        impact: 45,
        affected_species: ["Herring", "Cod"],
        description: "Improving sustainable fishing practices",
        last_updated: "2024-01-14"
      }
    ],
    overall_risk: 48,
    marine_protected_areas: 14,
    coastline_length: 3218,
    ocean_health_index: 78,
    wwf_risk_assessment: 'medium',
    iucn_ecosystem_risk: 'near_threatened',
    last_assessment: "2024-01-12"
  },
  {
    name: "Finland",
    code: "FI",
    threats: [
      {
        id: "fi-pollution-1",
        type: "pollution",
        severity: "medium",
        trend: "stable",
        impact: 50,
        affected_species: ["Baltic seals", "Sea eagles"],
        description: "Industrial runoff in Gulf of Finland",
        last_updated: "2024-01-13"
      }
    ],
    overall_risk: 42,
    marine_protected_areas: 12,
    coastline_length: 1250,
    ocean_health_index: 75,
    wwf_risk_assessment: 'medium',
    iucn_ecosystem_risk: 'near_threatened',
    last_assessment: "2024-01-13"
  },
  {
    name: "Denmark",
    code: "DK",
    threats: [
      {
        id: "dk-coastal-1",
        type: "coastal",
        severity: "medium",
        trend: "increasing",
        impact: 60,
        affected_species: ["Coastal fish", "Seagrass beds"],
        description: "Coastal development and land reclamation",
        last_updated: "2024-01-11"
      },
      {
        id: "dk-wind-1",
        type: "pollution",
        severity: "low",
        trend: "decreasing",
        impact: 25,
        affected_species: ["Marine mammals"],
        description: "Noise from offshore wind farms",
        last_updated: "2024-01-16"
      }
    ],
    overall_risk: 35,
    marine_protected_areas: 18,
    coastline_length: 7314,
    ocean_health_index: 82,
    wwf_risk_assessment: 'low',
    iucn_ecosystem_risk: 'least_concern',
    last_assessment: "2024-01-11"
  },
  {
    name: "Iceland",
    code: "IS",
    threats: [
      {
        id: "is-fish-1",
        type: "overfishing",
        severity: "medium",
        trend: "decreasing",
        impact: 55,
        affected_species: ["Atlantic Cod", "Herring"],
        description: "Sustainable fishing practices improving",
        last_updated: "2024-01-12"
      },
      {
        id: "is-climate-1",
        type: "climate",
        severity: "high",
        trend: "increasing",
        impact: 70,
        affected_species: ["Arctic terns", "Puffins"],
        description: "Changing ocean temperatures affecting fish migration",
        last_updated: "2024-01-09"
      }
    ],
    overall_risk: 52,
    marine_protected_areas: 12,
    coastline_length: 4970,
    ocean_health_index: 68,
    wwf_risk_assessment: 'medium',
    iucn_ecosystem_risk: 'vulnerable',
    last_assessment: "2024-01-09"
  },

  // Western Europe
  {
    name: "United Kingdom",
    code: "GB",
    threats: [
      {
        id: "uk-plastic-1",
        type: "pollution",
        severity: "high",
        trend: "stable",
        impact: 70,
        affected_species: ["Seabirds", "Marine mammals"],
        description: "Plastic pollution in coastal waters",
        last_updated: "2024-01-14"
      },
      {
        id: "uk-coastal-1",
        type: "coastal",
        severity: "medium",
        trend: "increasing",
        impact: 60,
        affected_species: ["Coastal fish", "Seagrass"],
        description: "Coastal development pressure",
        last_updated: "2024-01-13"
      },
      {
        id: "uk-climate-1",
        type: "climate",
        severity: "high",
        trend: "increasing",
        impact: 75,
        affected_species: ["Coral reefs", "Kelp forests"],
        description: "Ocean warming affecting marine ecosystems",
        last_updated: "2024-01-10"
      }
    ],
    overall_risk: 68,
    marine_protected_areas: 8,
    coastline_length: 12429,
    ocean_health_index: 65,
    wwf_risk_assessment: 'high',
    iucn_ecosystem_risk: 'vulnerable',
    last_assessment: "2024-01-10"
  },
  {
    name: "Ireland",
    code: "IE",
    threats: [
      {
        id: "ie-fishing-1",
        type: "overfishing",
        severity: "medium",
        trend: "stable",
        impact: 50,
        affected_species: ["Mackerel", "Haddock"],
        description: "Commercial fishing pressure",
        last_updated: "2024-01-15"
      },
      {
        id: "ie-plastic-1",
        type: "pollution",
        severity: "medium",
        trend: "decreasing",
        impact: 45,
        affected_species: ["Dolphins", "Seabirds"],
        description: "Marine litter reduction efforts showing progress",
        last_updated: "2024-01-12"
      }
    ],
    overall_risk: 44,
    marine_protected_areas: 10,
    coastline_length: 1448,
    ocean_health_index: 71,
    wwf_risk_assessment: 'medium',
    iucn_ecosystem_risk: 'near_threatened',
    last_assessment: "2024-01-12"
  },
  {
    name: "France",
    code: "FR",
    threats: [
      {
        id: "fr-invasive-1",
        type: "invasive",
        severity: "medium",
        trend: "increasing",
        impact: 45,
        affected_species: ["Native shellfish", "Seaweed"],
        description: "Invasive species from shipping",
        last_updated: "2024-01-09"
      },
      {
        id: "fr-pollution-1",
        type: "pollution",
        severity: "high",
        trend: "stable",
        impact: 65,
        affected_species: ["Mediterranean fish", "Coastal birds"],
        description: "Agricultural runoff and industrial pollution",
        last_updated: "2024-01-14"
      }
    ],
    overall_risk: 58,
    marine_protected_areas: 22,
    coastline_length: 3427,
    ocean_health_index: 66,
    wwf_risk_assessment: 'medium',
    iucn_ecosystem_risk: 'vulnerable',
    last_assessment: "2024-01-09"
  },
  {
    name: "Spain",
    code: "ES",
    threats: [
      {
        id: "es-temp-1",
        type: "climate",
        severity: "high",
        trend: "increasing",
        impact: 80,
        affected_species: ["Mediterranean fish", "Coral communities"],
        description: "Rising sea temperatures in Mediterranean",
        last_updated: "2024-01-11"
      },
      {
        id: "es-fish-1",
        type: "overfishing",
        severity: "medium",
        trend: "stable",
        impact: 50,
        affected_species: ["Bluefin tuna", "Sardines"],
        description: "Commercial fishing pressure",
        last_updated: "2024-01-16"
      },
      {
        id: "es-coastal-1",
        type: "coastal",
        severity: "high",
        trend: "increasing",
        impact: 70,
        affected_species: ["Posidonia seagrass", "Coastal fish"],
        description: "Tourism development on coastlines",
        last_updated: "2024-01-08"
      }
    ],
    overall_risk: 72,
    marine_protected_areas: 18,
    coastline_length: 4964,
    ocean_health_index: 58,
    wwf_risk_assessment: 'high',
    iucn_ecosystem_risk: 'vulnerable',
    last_assessment: "2024-01-08"
  },
  {
    name: "Portugal",
    code: "PT",
    threats: [
      {
        id: "pt-fishing-1",
        type: "overfishing",
        severity: "high",
        trend: "stable",
        impact: 75,
        affected_species: ["Sardines", "Octopus"],
        description: "Intensive fishing in Atlantic waters",
        last_updated: "2024-01-13"
      },
      {
        id: "pt-climate-1",
        type: "climate",
        severity: "medium",
        trend: "increasing",
        impact: 55,
        affected_species: ["Tuna", "Sea turtles"],
        description: "Ocean warming affecting migration patterns",
        last_updated: "2024-01-10"
      }
    ],
    overall_risk: 62,
    marine_protected_areas: 16,
    coastline_length: 1793,
    ocean_health_index: 63,
    wwf_risk_assessment: 'high',
    iucn_ecosystem_risk: 'vulnerable',
    last_assessment: "2024-01-10"
  },
  {
    name: "Netherlands",
    code: "NL",
    threats: [
      {
        id: "nl-sea-level-1",
        type: "climate",
        severity: "critical",
        trend: "increasing",
        impact: 90,
        affected_species: ["Wadden Sea life", "Coastal birds"],
        description: "Sea level rise threatening coastal ecosystems",
        last_updated: "2024-01-12"
      },
      {
        id: "nl-pollution-1",
        type: "pollution",
        severity: "medium",
        trend: "decreasing",
        impact: 40,
        affected_species: ["Harbor seals", "Porpoises"],
        description: "Industrial pollution reduction efforts",
        last_updated: "2024-01-15"
      }
    ],
    overall_risk: 68,
    marine_protected_areas: 20,
    coastline_length: 451,
    ocean_health_index: 70,
    wwf_risk_assessment: 'high',
    iucn_ecosystem_risk: 'endangered',
    last_assessment: "2024-01-12"
  },
  {
    name: "Belgium",
    code: "BE",
    threats: [
      {
        id: "be-shipping-1",
        type: "pollution",
        severity: "high",
        trend: "stable",
        impact: 70,
        affected_species: ["Marine mammals", "Seabirds"],
        description: "Heavy shipping traffic pollution",
        last_updated: "2024-01-14"
      }
    ],
    overall_risk: 58,
    marine_protected_areas: 8,
    coastline_length: 66,
    ocean_health_index: 62,
    wwf_risk_assessment: 'medium',
    iucn_ecosystem_risk: 'vulnerable',
    last_assessment: "2024-01-14"
  },
  {
    name: "Germany",
    code: "DE",
    threats: [
      {
        id: "de-baltic-1",
        type: "pollution",
        severity: "medium",
        trend: "stable",
        impact: 55,
        affected_species: ["Baltic fish", "Marine birds"],
        description: "Agricultural runoff in Baltic Sea",
        last_updated: "2024-01-11"
      },
      {
        id: "de-wind-1",
        type: "coastal",
        severity: "low",
        trend: "increasing",
        impact: 30,
        affected_species: ["Marine mammals"],
        description: "Offshore wind farm development",
        last_updated: "2024-01-16"
      }
    ],
    overall_risk: 42,
    marine_protected_areas: 15,
    coastline_length: 2389,
    ocean_health_index: 74,
    wwf_risk_assessment: 'medium',
    iucn_ecosystem_risk: 'near_threatened',
    last_assessment: "2024-01-11"
  },

  // Southern Europe
  {
    name: "Italy",
    code: "IT",
    threats: [
      {
        id: "it-acid-1",
        type: "acidification",
        severity: "high",
        trend: "increasing",
        impact: 75,
        affected_species: ["Shellfish", "Coral"],
        description: "Ocean acidification in Mediterranean",
        last_updated: "2024-01-08"
      },
      {
        id: "it-pollution-1",
        type: "pollution",
        severity: "high",
        trend: "stable",
        impact: 70,
        affected_species: ["Dolphins", "Sea turtles"],
        description: "Plastic and chemical pollution",
        last_updated: "2024-01-12"
      }
    ],
    overall_risk: 68,
    marine_protected_areas: 16,
    coastline_length: 7600,
    ocean_health_index: 59,
    wwf_risk_assessment: 'high',
    iucn_ecosystem_risk: 'vulnerable',
    last_assessment: "2024-01-08"
  },
  {
    name: "Greece",
    code: "GR",
    threats: [
      {
        id: "gr-tourism-1",
        type: "coastal",
        severity: "high",
        trend: "increasing",
        impact: 80,
        affected_species: ["Posidonia meadows", "Monk seals"],
        description: "Tourism pressure on coastal ecosystems",
        last_updated: "2024-01-09"
      },
      {
        id: "gr-fishing-1",
        type: "overfishing",
        severity: "medium",
        trend: "stable",
        impact: 60,
        affected_species: ["Mediterranean fish", "Octopus"],
        description: "Traditional and commercial fishing pressure",
        last_updated: "2024-01-13"
      },
      {
        id: "gr-climate-1",
        type: "climate",
        severity: "high",
        trend: "increasing",
        impact: 75,
        affected_species: ["Coral communities", "Endemic fish"],
        description: "Mediterranean warming and marine heatwaves",
        last_updated: "2024-01-10"
      }
    ],
    overall_risk: 74,
    marine_protected_areas: 12,
    coastline_length: 13676,
    ocean_health_index: 56,
    wwf_risk_assessment: 'high',
    iucn_ecosystem_risk: 'endangered',
    last_assessment: "2024-01-09"
  },
  {
    name: "Cyprus",
    code: "CY",
    threats: [
      {
        id: "cy-climate-1",
        type: "climate",
        severity: "high",
        trend: "increasing",
        impact: 78,
        affected_species: ["Sea turtles", "Seagrass"],
        description: "Extreme heat affecting nesting beaches",
        last_updated: "2024-01-11"
      },
      {
        id: "cy-coastal-1",
        type: "coastal",
        severity: "medium",
        trend: "increasing",
        impact: 65,
        affected_species: ["Coastal fish", "Marine vegetation"],
        description: "Tourism development on coastlines",
        last_updated: "2024-01-14"
      }
    ],
    overall_risk: 68,
    marine_protected_areas: 8,
    coastline_length: 648,
    ocean_health_index: 61,
    wwf_risk_assessment: 'high',
    iucn_ecosystem_risk: 'vulnerable',
    last_assessment: "2024-01-11"
  },
  {
    name: "Malta",
    code: "MT",
    threats: [
      {
        id: "mt-fishing-1",
        type: "overfishing",
        severity: "high",
        trend: "stable",
        impact: 80,
        affected_species: ["Bluefin tuna", "Swordfish"],
        description: "Intensive fishing around small island",
        last_updated: "2024-01-12"
      },
      {
        id: "mt-development-1",
        type: "coastal",
        severity: "medium",
        trend: "increasing",
        impact: 70,
        affected_species: ["Endemic fish", "Rocky shore life"],
        description: "Limited coastline under development pressure",
        last_updated: "2024-01-15"
      }
    ],
    overall_risk: 72,
    marine_protected_areas: 6,
    coastline_length: 197,
    ocean_health_index: 54,
    wwf_risk_assessment: 'high',
    iucn_ecosystem_risk: 'endangered',
    last_assessment: "2024-01-12"
  },
  {
    name: "Croatia",
    code: "HR",
    threats: [
      {
        id: "hr-tourism-1",
        type: "coastal",
        severity: "high",
        trend: "increasing",
        impact: 75,
        affected_species: ["Adriatic fish", "Seagrass beds"],
        description: "Massive tourism growth impacting Adriatic coast",
        last_updated: "2024-01-13"
      },
      {
        id: "hr-pollution-1",
        type: "pollution",
        severity: "medium",
        trend: "stable",
        impact: 50,
        affected_species: ["Dolphins", "Sea turtles"],
        description: "Marine litter and wastewater issues",
        last_updated: "2024-01-10"
      }
    ],
    overall_risk: 58,
    marine_protected_areas: 14,
    coastline_length: 5835,
    ocean_health_index: 64,
    wwf_risk_assessment: 'medium',
    iucn_ecosystem_risk: 'vulnerable',
    last_assessment: "2024-01-10"
  },
  {
    name: "Slovenia",
    code: "SI",
    threats: [
      {
        id: "si-pollution-1",
        type: "pollution",
        severity: "medium",
        trend: "decreasing",
        impact: 45,
        affected_species: ["Adriatic fish", "Coastal birds"],
        description: "Industrial runoff improvement efforts",
        last_updated: "2024-01-14"
      }
    ],
    overall_risk: 38,
    marine_protected_areas: 10,
    coastline_length: 47,
    ocean_health_index: 73,
    wwf_risk_assessment: 'low',
    iucn_ecosystem_risk: 'near_threatened',
    last_assessment: "2024-01-14"
  },
  {
    name: "Montenegro",
    code: "ME",
    threats: [
      {
        id: "me-tourism-1",
        type: "coastal",
        severity: "medium",
        trend: "increasing",
        impact: 60,
        affected_species: ["Coastal marine life", "Seagrass"],
        description: "Tourism development pressure",
        last_updated: "2024-01-12"
      }
    ],
    overall_risk: 48,
    marine_protected_areas: 8,
    coastline_length: 294,
    ocean_health_index: 67,
    wwf_risk_assessment: 'medium',
    iucn_ecosystem_risk: 'near_threatened',
    last_assessment: "2024-01-12"
  },
  {
    name: "Albania",
    code: "AL",
    threats: [
      {
        id: "al-pollution-1",
        type: "pollution",
        severity: "high",
        trend: "stable",
        impact: 70,
        affected_species: ["Adriatic fish", "Marine mammals"],
        description: "Inadequate wastewater treatment",
        last_updated: "2024-01-11"
      },
      {
        id: "al-fishing-1",
        type: "overfishing",
        severity: "medium",
        trend: "stable",
        impact: 55,
        affected_species: ["Coastal fish", "Shellfish"],
        description: "Unregulated fishing practices",
        last_updated: "2024-01-15"
      }
    ],
    overall_risk: 62,
    marine_protected_areas: 4,
    coastline_length: 362,
    ocean_health_index: 52,
    wwf_risk_assessment: 'high',
    iucn_ecosystem_risk: 'vulnerable',
    last_assessment: "2024-01-11"
  },
  {
    name: "Bosnia and Herzegovina",
    code: "BA",
    threats: [
      {
        id: "ba-pollution-1",
        type: "pollution",
        severity: "medium",
        trend: "stable",
        impact: 50,
        affected_species: ["Coastal fish"],
        description: "Limited coastal pollution from rivers",
        last_updated: "2024-01-13"
      }
    ],
    overall_risk: 40,
    marine_protected_areas: 2,
    coastline_length: 20,
    ocean_health_index: 69,
    wwf_risk_assessment: 'medium',
    iucn_ecosystem_risk: 'near_threatened',
    last_assessment: "2024-01-13"
  },

  // Eastern Europe
  {
    name: "Poland",
    code: "PL",
    threats: [
      {
        id: "pl-baltic-1",
        type: "pollution",
        severity: "medium",
        trend: "decreasing",
        impact: 50,
        affected_species: ["Baltic fish", "Seabirds"],
        description: "Industrial pollution reduction in Baltic Sea",
        last_updated: "2024-01-14"
      },
      {
        id: "pl-algae-1",
        type: "pollution",
        severity: "medium",
        trend: "stable",
        impact: 45,
        affected_species: ["Fish populations", "Marine birds"],
        description: "Nutrient pollution causing algal blooms",
        last_updated: "2024-01-12"
      }
    ],
    overall_risk: 46,
    marine_protected_areas: 12,
    coastline_length: 491,
    ocean_health_index: 71,
    wwf_risk_assessment: 'medium',
    iucn_ecosystem_risk: 'near_threatened',
    last_assessment: "2024-01-12"
  },
  {
    name: "Lithuania",
    code: "LT",
    threats: [
      {
        id: "lt-amber-1",
        type: "coastal",
        severity: "low",
        trend: "stable",
        impact: 25,
        affected_species: ["Coastal ecosystems"],
        description: "Amber mining impact on coastline",
        last_updated: "2024-01-15"
      },
      {
        id: "lt-climate-1",
        type: "climate",
        severity: "medium",
        trend: "increasing",
        impact: 40,
        affected_species: ["Baltic seals", "Coastal birds"],
        description: "Baltic Sea warming trends",
        last_updated: "2024-01-11"
      }
    ],
    overall_risk: 35,
    marine_protected_areas: 9,
    coastline_length: 90,
    ocean_health_index: 76,
    wwf_risk_assessment: 'low',
    iucn_ecosystem_risk: 'least_concern',
    last_assessment: "2024-01-11"
  },
  {
    name: "Latvia",
    code: "LV",
    threats: [
      {
        id: "lv-pollution-1",
        type: "pollution",
        severity: "medium",
        trend: "decreasing",
        impact: 40,
        affected_species: ["Baltic fish", "Marine mammals"],
        description: "Improving water quality in Baltic Sea",
        last_updated: "2024-01-13"
      }
    ],
    overall_risk: 32,
    marine_protected_areas: 11,
    coastline_length: 494,
    ocean_health_index: 79,
    wwf_risk_assessment: 'low',
    iucn_ecosystem_risk: 'least_concern',
    last_assessment: "2024-01-13"
  },
  {
    name: "Estonia",
    code: "EE",
    threats: [
      {
        id: "ee-shipping-1",
        type: "pollution",
        severity: "medium",
        trend: "stable",
        impact: 45,
        affected_species: ["Baltic marine life", "Seabirds"],
        description: "Shipping route pollution in Baltic Sea",
        last_updated: "2024-01-14"
      }
    ],
    overall_risk: 38,
    marine_protected_areas: 13,
    coastline_length: 3794,
    ocean_health_index: 77,
    wwf_risk_assessment: 'low',
    iucn_ecosystem_risk: 'least_concern',
    last_assessment: "2024-01-14"
  },
  {
    name: "Russia",
    code: "RU",
    threats: [
      {
        id: "ru-arctic-1",
        type: "climate",
        severity: "critical",
        trend: "increasing",
        impact: 95,
        affected_species: ["Arctic marine life", "Polar bears"],
        description: "Rapid Arctic ice loss and ecosystem disruption",
        last_updated: "2024-01-10"
      },
      {
        id: "ru-pollution-1",
        type: "pollution",
        severity: "high",
        trend: "stable",
        impact: 80,
        affected_species: ["Marine mammals", "Fish populations"],
        description: "Industrial pollution in Arctic and Baltic waters",
        last_updated: "2024-01-12"
      }
    ],
    overall_risk: 85,
    marine_protected_areas: 5,
    coastline_length: 37653,
    ocean_health_index: 42,
    wwf_risk_assessment: 'critical',
    iucn_ecosystem_risk: 'critically_endangered',
    last_assessment: "2024-01-10"
  },
  {
    name: "Ukraine",
    code: "UA",
    threats: [
      {
        id: "ua-conflict-1",
        type: "pollution",
        severity: "critical",
        trend: "increasing",
        impact: 90,
        affected_species: ["Black Sea dolphins", "Fish populations"],
        description: "War-related environmental damage in Black Sea",
        last_updated: "2024-01-16"
      },
      {
        id: "ua-algae-1",
        type: "pollution",
        severity: "high",
        trend: "stable",
        impact: 75,
        affected_species: ["Black Sea fish", "Marine birds"],
        description: "Nutrient pollution and algal blooms",
        last_updated: "2024-01-14"
      }
    ],
    overall_risk: 88,
    marine_protected_areas: 3,
    coastline_length: 2782,
    ocean_health_index: 38,
    wwf_risk_assessment: 'critical',
    iucn_ecosystem_risk: 'critically_endangered',
    last_assessment: "2024-01-14"
  },
  {
    name: "Romania",
    code: "RO",
    threats: [
      {
        id: "ro-danube-1",
        type: "pollution",
        severity: "high",
        trend: "stable",
        impact: 70,
        affected_species: ["Black Sea fish", "Dolphins"],
        description: "Danube River pollution affecting Black Sea",
        last_updated: "2024-01-13"
      },
      {
        id: "ro-coastal-1",
        type: "coastal",
        severity: "medium",
        trend: "increasing",
        impact: 55,
        affected_species: ["Coastal ecosystems", "Migratory birds"],
        description: "Tourism development on Black Sea coast",
        last_updated: "2024-01-11"
      }
    ],
    overall_risk: 62,
    marine_protected_areas: 7,
    coastline_length: 225,
    ocean_health_index: 58,
    wwf_risk_assessment: 'high',
    iucn_ecosystem_risk: 'vulnerable',
    last_assessment: "2024-01-11"
  },
  {
    name: "Bulgaria",
    code: "BG",
    threats: [
      {
        id: "bg-pollution-1",
        type: "pollution",
        severity: "medium",
        trend: "decreasing",
        impact: 50,
        affected_species: ["Black Sea fish", "Marine mammals"],
        description: "Improving wastewater treatment reducing pollution",
        last_updated: "2024-01-12"
      },
      {
        id: "bg-fishing-1",
        type: "overfishing",
        severity: "medium",
        trend: "stable",
        impact: 45,
        affected_species: ["Anchovy", "Sprat"],
        description: "Commercial fishing pressure in Black Sea",
        last_updated: "2024-01-15"
      }
    ],
    overall_risk: 48,
    marine_protected_areas: 9,
    coastline_length: 354,
    ocean_health_index: 65,
    wwf_risk_assessment: 'medium',
    iucn_ecosystem_risk: 'near_threatened',
    last_assessment: "2024-01-12"
  },

  // Turkey (European part)
  {
    name: "Turkey",
    code: "TR",
    threats: [
      {
        id: "tr-bosphorus-1",
        type: "pollution",
        severity: "high",
        trend: "stable",
        impact: 75,
        affected_species: ["Black Sea dolphins", "Migratory fish"],
        description: "Heavy shipping traffic through Bosphorus",
        last_updated: "2024-01-14"
      },
      {
        id: "tr-climate-1",
        type: "climate",
        severity: "high",
        trend: "increasing",
        impact: 70,
        affected_species: ["Mediterranean species", "Endemic fish"],
        description: "Rapid warming in Eastern Mediterranean",
        last_updated: "2024-01-10"
      },
      {
        id: "tr-fishing-1",
        type: "overfishing",
        severity: "medium",
        trend: "stable",
        impact: 60,
        affected_species: ["Anchovy", "Mediterranean fish"],
        description: "Intensive fishing in multiple seas",
        last_updated: "2024-01-13"
      }
    ],
    overall_risk: 72,
    marine_protected_areas: 6,
    coastline_length: 7200,
    ocean_health_index: 55,
    wwf_risk_assessment: 'high',
    iucn_ecosystem_risk: 'vulnerable',
    last_assessment: "2024-01-10"
  }
];

const threatTypeConfig = {
  pollution: { icon: Factory, color: "threat-critical", label: "Pollution" },
  overfishing: { icon: Fish, color: "threat-high", label: "Overfishing" },
  climate: { icon: Thermometer, color: "threat-critical", label: "Climate Change" },
  invasive: { icon: AlertTriangle, color: "threat-medium", label: "Invasive Species" },
  coastal: { icon: Waves, color: "threat-medium", label: "Coastal Development" },
  acidification: { icon: Shield, color: "threat-high", label: "Ocean Acidification" }
};

const severityConfig = {
  critical: { color: "threat-critical", label: "Critical" },
  high: { color: "threat-high", label: "High" },
  medium: { color: "threat-medium", label: "Medium" },
  low: { color: "threat-low", label: "Low" }
};

const wwfConfig = {
  critical: { color: "threat-critical", label: "Critical Risk" },
  high: { color: "threat-high", label: "High Risk" },
  medium: { color: "threat-medium", label: "Medium Risk" },
  low: { color: "threat-low", label: "Low Risk" }
};

const iucnConfig = {
  critically_endangered: { color: "threat-critical", label: "Critically Endangered" },
  endangered: { color: "threat-high", label: "Endangered" },
  vulnerable: { color: "threat-medium", label: "Vulnerable" },
  near_threatened: { color: "threat-medium", label: "Near Threatened" },
  least_concern: { color: "threat-low", label: "Least Concern" }
};

export default function MarineDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedThreatType, setSelectedThreatType] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");

  const filteredData = useMemo(() => {
    return europeanCountries.filter(country => {
      const matchesSearch = country.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCountry = selectedCountry === "all" || country.code === selectedCountry;
      
      if (!matchesSearch || !matchesCountry) return false;

      if (selectedThreatType === "all" && selectedSeverity === "all") return true;

      return country.threats.some(threat => {
        const matchesThreatType = selectedThreatType === "all" || threat.type === selectedThreatType;
        const matchesSeverity = selectedSeverity === "all" || threat.severity === selectedSeverity;
        return matchesThreatType && matchesSeverity;
      });
    });
  }, [searchTerm, selectedCountry, selectedThreatType, selectedSeverity]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-threat-critical" />;
      case 'decreasing': return <TrendingDown className="h-4 w-4 text-threat-low" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const totalThreats = europeanCountries.reduce((sum, country) => sum + country.threats.length, 0);
  const avgRisk = Math.round(europeanCountries.reduce((sum, country) => sum + country.overall_risk, 0) / europeanCountries.length);
  const criticalThreats = europeanCountries.reduce((sum, country) => 
    sum + country.threats.filter(t => t.severity === 'critical').length, 0
  );
  const avgOHI = Math.round(europeanCountries.reduce((sum, country) => sum + country.ocean_health_index, 0) / europeanCountries.length);

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <div className="bg-gradient-ocean border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Waves className="h-8 w-8 text-primary-foreground animate-wave" />
            <h1 className="text-3xl font-bold text-primary-foreground">
              European Marine Threat Monitor
            </h1>
          </div>
          <p className="text-primary-foreground/80 max-w-2xl">
            Real-time monitoring with scientific indices: Ocean Health Index, WWF Risk Assessment, and IUCN Red List ecosystem rankings
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-card shadow-card-ocean">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Threats</p>
                  <p className="text-2xl font-bold text-foreground">{totalThreats}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-card-ocean">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Risk</p>
                  <p className="text-2xl font-bold text-foreground">{avgRisk}%</p>
                </div>
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-card-ocean">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Critical Threats</p>
                  <p className="text-2xl font-bold text-threat-critical">{criticalThreats}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-threat-critical animate-pulse-glow" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-card-ocean">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Ocean Health</p>
                  <p className="text-2xl font-bold text-accent">{avgOHI}</p>
                </div>
                <Award className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-card-ocean">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Countries</p>
                  <p className="text-2xl font-bold text-foreground">{europeanCountries.length}</p>
                </div>
                <Waves className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8 shadow-card-ocean">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Countries</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search countries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Country</label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {europeanCountries.map(country => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Threat Type</label>
                <Select value={selectedThreatType} onValueChange={setSelectedThreatType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select threat type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {Object.entries(threatTypeConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Severity</label>
                <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    {Object.entries(severityConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Country Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredData.map((country) => (
            <Card key={country.code} className="shadow-card-ocean hover:shadow-ocean transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{country.name}</CardTitle>
                  <Badge variant={
                    country.overall_risk >= 70 ? "destructive" :
                    country.overall_risk >= 50 ? "secondary" : "outline"
                  }>
                    Risk: {country.overall_risk}%
                  </Badge>
                </div>
                <CardDescription>
                  {country.coastline_length.toLocaleString()} km coastline • {country.marine_protected_areas}% protected areas
                </CardDescription>
                <Progress value={country.overall_risk} className="w-full" />
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="threats" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="threats">Threats ({country.threats.length})</TabsTrigger>
                    <TabsTrigger value="indices">Indices</TabsTrigger>
                    <TabsTrigger value="stats">Statistics</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="threats" className="space-y-3 mt-4">
                    {country.threats.map((threat) => {
                      const ThreatIcon = threatTypeConfig[threat.type].icon;
                      return (
                        <Alert key={threat.id} className={cn(
                          "border-l-4",
                          threat.severity === 'critical' && "border-l-threat-critical",
                          threat.severity === 'high' && "border-l-threat-high",
                          threat.severity === 'medium' && "border-l-threat-medium",
                          threat.severity === 'low' && "border-l-threat-low"
                        )}>
                          <ThreatIcon className="h-4 w-4" />
                          <AlertDescription>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    {threatTypeConfig[threat.type].label}
                                  </Badge>
                                  <Badge variant={
                                    threat.severity === 'critical' ? "destructive" :
                                    threat.severity === 'high' ? "secondary" : "outline"
                                  } className="text-xs">
                                    {severityConfig[threat.severity].label}
                                  </Badge>
                                  {getTrendIcon(threat.trend)}
                                </div>
                                <p className="text-sm mb-1">{threat.description}</p>
                                <p className="text-xs text-muted-foreground">
                                  Affected: {threat.affected_species.join(", ")}
                                </p>
                                <div className="mt-2">
                                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                    <span>Impact Level</span>
                                    <span>{threat.impact}%</span>
                                  </div>
                                  <Progress value={threat.impact} className="h-2" />
                                </div>
                              </div>
                            </div>
                          </AlertDescription>
                        </Alert>
                      );
                    })}
                  </TabsContent>

                  <TabsContent value="indices" className="mt-4">
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <BarChart3 className="h-5 w-5 text-primary" />
                          <h4 className="font-semibold">Ocean Health Index</h4>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Score (0-100, higher better)</span>
                          <span className="text-lg font-bold text-primary">{country.ocean_health_index}</span>
                        </div>
                        <Progress value={country.ocean_health_index} className="h-2" />
                      </div>

                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Shield className="h-5 w-5 text-warning" />
                          <h4 className="font-semibold">WWF Risk Assessment</h4>
                        </div>
                        <Badge className={cn(
                          "w-full justify-center",
                          country.wwf_risk_assessment === 'critical' && "bg-threat-critical text-white",
                          country.wwf_risk_assessment === 'high' && "bg-threat-high text-white",
                          country.wwf_risk_assessment === 'medium' && "bg-threat-medium text-white",
                          country.wwf_risk_assessment === 'low' && "bg-threat-low text-white"
                        )}>
                          {wwfConfig[country.wwf_risk_assessment].label}
                        </Badge>
                      </div>

                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Target className="h-5 w-5 text-destructive" />
                          <h4 className="font-semibold">IUCN Ecosystem Risk</h4>
                        </div>
                        <Badge className={cn(
                          "w-full justify-center",
                          country.iucn_ecosystem_risk === 'critically_endangered' && "bg-threat-critical text-white",
                          country.iucn_ecosystem_risk === 'endangered' && "bg-threat-high text-white",
                          country.iucn_ecosystem_risk === 'vulnerable' && "bg-threat-medium text-white",
                          country.iucn_ecosystem_risk === 'near_threatened' && "bg-threat-medium text-white",
                          country.iucn_ecosystem_risk === 'least_concern' && "bg-threat-low text-white"
                        )}>
                          {iucnConfig[country.iucn_ecosystem_risk].label}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-2">
                          Last assessment: {country.last_assessment}
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="stats" className="mt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <p className="text-2xl font-bold text-primary">{country.marine_protected_areas}%</p>
                          <p className="text-sm text-muted-foreground">Protected Areas</p>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <p className="text-2xl font-bold text-accent">{country.coastline_length.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">km Coastline</p>
                        </div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold text-foreground">{country.threats.length}</p>
                        <p className="text-sm text-muted-foreground">Active Threats</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredData.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Waves className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No data found</h3>
              <p className="text-muted-foreground">Try adjusting your filters to see more results.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
