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
  Target,
  Heart
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
        affected_species: ["Arctic Cod", "Seal populations", "Beluga whales"],
        description: "Oil drilling activities in Arctic waters",
        last_updated: "2024-01-15"
      },
      {
        id: "no-climate-1",
        type: "climate",
        severity: "critical",
        trend: "increasing",
        impact: 85,
        affected_species: ["Polar bears", "Arctic marine life", "Walrus", "Ringed seals"],
        description: "Rapid ice melting affecting marine ecosystems",
        last_updated: "2024-01-10"
      },
      {
        id: "no-fish-1",
        type: "overfishing",
        severity: "high",
        trend: "stable",
        impact: 70,
        affected_species: ["Atlantic salmon", "Capelin", "Blue whiting", "Herring"],
        description: "Intensive commercial fishing depleting fish stocks",
        last_updated: "2024-01-16"
      },
      {
        id: "no-pollution-2",
        type: "pollution",
        severity: "medium",
        trend: "increasing",
        impact: 60,
        affected_species: ["Seabirds", "Arctic terns", "Guillemots"],
        description: "Microplastics contamination in feeding areas",
        last_updated: "2024-01-14"
      },
      {
        id: "no-shipping-1",
        type: "pollution",
        severity: "medium",
        trend: "increasing",
        impact: 55,
        affected_species: ["Narwhals", "Bowhead whales", "Arctic char"],
        description: "Increased Arctic shipping routes causing noise pollution",
        last_updated: "2024-01-13"
      },
      {
        id: "no-coastal-1",
        type: "coastal",
        severity: "medium",
        trend: "increasing",
        impact: 50,
        affected_species: ["Kelp forests", "Sea urchins", "Coastal fish"],
        description: "Coastal infrastructure development",
        last_updated: "2024-01-12"
      },
      {
        id: "no-invasive-1",
        type: "invasive",
        severity: "medium",
        trend: "increasing",
        impact: 45,
        affected_species: ["King crab", "Native bottom fauna"],
        description: "Red king crab invasion affecting benthic communities",
        last_updated: "2024-01-11"
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
        affected_species: ["Baltic fish", "Seabirds", "Baltic salmon", "Perch"],
        description: "Algal blooms in Baltic Sea reducing oxygen levels",
        last_updated: "2024-01-12"
      },
      {
        id: "se-fishing-1",
        type: "overfishing",
        severity: "medium",
        trend: "decreasing",
        impact: 45,
        affected_species: ["Herring", "Cod", "Sprat", "Flounder"],
        description: "Improving sustainable fishing practices",
        last_updated: "2024-01-14"
      },
      {
        id: "se-climate-1",
        type: "climate",
        severity: "high",
        trend: "increasing",
        impact: 65,
        affected_species: ["Baltic seals", "Eider ducks", "Arctic char"],
        description: "Warming waters changing species distribution",
        last_updated: "2024-01-13"
      },
      {
        id: "se-pollution-1",
        type: "pollution",
        severity: "medium",
        trend: "decreasing",
        impact: 40,
        affected_species: ["Harbor porpoises", "Gray seals", "Common terns"],
        description: "Industrial contaminants from legacy sources",
        last_updated: "2024-01-15"
      },
      {
        id: "se-invasive-1",
        type: "invasive",
        severity: "medium",
        trend: "increasing",
        impact: 50,
        affected_species: ["Round goby", "Native benthic species"],
        description: "Invasive round goby disrupting food webs",
        last_updated: "2024-01-11"
      },
      {
        id: "se-acidification-1",
        type: "acidification",
        severity: "medium",
        trend: "increasing",
        impact: 55,
        affected_species: ["Mussels", "Barnacles", "Sea snails"],
        description: "Ocean acidification affecting calcifying organisms",
        last_updated: "2024-01-10"
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
        affected_species: ["Baltic seals", "Sea eagles", "Ringed seals"],
        description: "Industrial runoff in Gulf of Finland",
        last_updated: "2024-01-13"
      },
      {
        id: "fi-forest-1",
        type: "pollution",
        severity: "medium",
        trend: "increasing",
        impact: 60,
        affected_species: ["Salmon", "Brown trout", "Grayling"],
        description: "Forestry runoff affecting coastal waters",
        last_updated: "2024-01-14"
      },
      {
        id: "fi-climate-1",
        type: "climate",
        severity: "high",
        trend: "increasing",
        impact: 70,
        affected_species: ["Arctic species", "Saimaa seal", "Landlocked salmon"],
        description: "Rapid warming affecting lake and coastal ecosystems",
        last_updated: "2024-01-12"
      },
      {
        id: "fi-invasive-1",
        type: "invasive",
        severity: "medium",
        trend: "increasing",
        impact: 45,
        affected_species: ["Four-horned sculpin", "Native fish species"],
        description: "Invasive signal crayfish affecting native species",
        last_updated: "2024-01-11"
      },
      {
        id: "fi-shipping-1",
        type: "pollution",
        severity: "medium",
        trend: "stable",
        impact: 40,
        affected_species: ["Baltic porpoises", "Seabirds"],
        description: "Commercial shipping traffic in Baltic routes",
        last_updated: "2024-01-15"
      },
      {
        id: "fi-coastal-1",
        type: "coastal",
        severity: "low",
        trend: "increasing",
        impact: 35,
        affected_species: ["Coastal vegetation", "Brackish water species"],
        description: "Summer cottage development on archipelago",
        last_updated: "2024-01-16"
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
        affected_species: ["Coastal fish", "Seagrass beds", "Eelgrass", "Pipefish"],
        description: "Coastal development and land reclamation",
        last_updated: "2024-01-11"
      },
      {
        id: "dk-wind-1",
        type: "pollution",
        severity: "low",
        trend: "decreasing",
        impact: 25,
        affected_species: ["Harbor porpoises", "Seals", "Seabirds"],
        description: "Noise from offshore wind farms",
        last_updated: "2024-01-16"
      },
      {
        id: "dk-agriculture-1",
        type: "pollution",
        severity: "high",
        trend: "stable",
        impact: 75,
        affected_species: ["Danish straits fish", "Mussel beds", "Algae"],
        description: "Agricultural nitrogen runoff causing eutrophication",
        last_updated: "2024-01-13"
      },
      {
        id: "dk-fishing-1",
        type: "overfishing",
        severity: "medium",
        trend: "stable",
        impact: 50,
        affected_species: ["Cod", "Plaice", "Sole", "Turbot"],
        description: "Bottom trawling affecting seafloor communities",
        last_updated: "2024-01-12"
      },
      {
        id: "dk-invasive-1",
        type: "invasive",
        severity: "medium",
        trend: "increasing",
        impact: 40,
        affected_species: ["Pacific oyster", "Native shellfish"],
        description: "Invasive Pacific oysters displacing native species",
        last_updated: "2024-01-14"
      },
      {
        id: "dk-climate-1",
        type: "climate",
        severity: "medium",
        trend: "increasing",
        impact: 55,
        affected_species: ["Arctic species", "Temperate migrants"],
        description: "Changing water temperatures affecting species ranges",
        last_updated: "2024-01-10"
      },
      {
        id: "dk-shipping-1",
        type: "pollution",
        severity: "medium",
        trend: "stable",
        impact: 45,
        affected_species: ["Marine mammals", "Seabirds"],
        description: "Heavy shipping traffic in Danish straits",
        last_updated: "2024-01-15"
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
        affected_species: ["Atlantic Cod", "Herring", "Capelin", "Haddock"],
        description: "Sustainable fishing practices improving",
        last_updated: "2024-01-12"
      },
      {
        id: "is-climate-1",
        type: "climate",
        severity: "high",
        trend: "increasing",
        impact: 70,
        affected_species: ["Arctic terns", "Puffins", "Guillemots", "Kittiwakes"],
        description: "Changing ocean temperatures affecting fish migration",
        last_updated: "2024-01-09"
      },
      {
        id: "is-volcanic-1",
        type: "pollution",
        severity: "medium",
        trend: "stable",
        impact: 45,
        affected_species: ["Seabirds", "Marine plankton", "Kelp forests"],
        description: "Volcanic ash deposits affecting marine ecosystems",
        last_updated: "2024-01-14"
      },
      {
        id: "is-whaling-1",
        type: "overfishing",
        severity: "medium",
        trend: "stable",
        impact: 50,
        affected_species: ["Minke whales", "Fin whales", "Marine mammals"],
        description: "Commercial whaling activities",
        last_updated: "2024-01-13"
      },
      {
        id: "is-invasive-1",
        type: "invasive",
        severity: "low",
        trend: "increasing",
        impact: 30,
        affected_species: ["Native algae", "Shellfish"],
        description: "Invasive marine species from shipping",
        last_updated: "2024-01-11"
      },
      {
        id: "is-acidification-1",
        type: "acidification",
        severity: "high",
        trend: "increasing",
        impact: 65,
        affected_species: ["Pteropods", "Shell-forming plankton", "Arctic char"],
        description: "Arctic ocean acidification affecting calcifying organisms",
        last_updated: "2024-01-10"
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
        affected_species: ["Seabirds", "Marine mammals", "Gannets", "Fulmar"],
        description: "Plastic pollution in coastal waters",
        last_updated: "2024-01-14"
      },
      {
        id: "uk-coastal-1",
        type: "coastal",
        severity: "medium",
        trend: "increasing",
        impact: 60,
        affected_species: ["Coastal fish", "Seagrass", "Razorbill", "Puffins"],
        description: "Coastal development pressure",
        last_updated: "2024-01-13"
      },
      {
        id: "uk-climate-1",
        type: "climate",
        severity: "high",
        trend: "increasing",
        impact: 75,
        affected_species: ["Coral reefs", "Kelp forests", "Cold-water corals", "Sea fans"],
        description: "Ocean warming affecting marine ecosystems",
        last_updated: "2024-01-10"
      },
      {
        id: "uk-fishing-1",
        type: "overfishing",
        severity: "high",
        trend: "stable",
        impact: 80,
        affected_species: ["Cod", "Haddock", "Sole", "Plaice", "Skates", "Rays"],
        description: "Overfishing depleting commercial fish stocks",
        last_updated: "2024-01-15"
      },
      {
        id: "uk-shipping-1",
        type: "pollution",
        severity: "medium",
        trend: "stable",
        impact: 55,
        affected_species: ["Whales", "Dolphins", "Porpoises", "Seals"],
        description: "Heavy shipping traffic causing noise pollution",
        last_updated: "2024-01-12"
      },
      {
        id: "uk-invasive-1",
        type: "invasive",
        severity: "medium",
        trend: "increasing",
        impact: 50,
        affected_species: ["Chinese mitten crab", "Japanese knotweed", "Native species"],
        description: "Invasive species threatening native marine life",
        last_updated: "2024-01-11"
      },
      {
        id: "uk-sewage-1",
        type: "pollution",
        severity: "high",
        trend: "increasing",
        impact: 70,
        affected_species: ["Marine bacteria", "Shellfish", "Coastal ecosystems"],
        description: "Sewage overflow events contaminating coastal waters",
        last_updated: "2024-01-16"
      },
      {
        id: "uk-acidification-1",
        type: "acidification",
        severity: "medium",
        trend: "increasing",
        impact: 60,
        affected_species: ["Mussels", "Oysters", "Sea urchins", "Barnacles"],
        description: "Ocean acidification affecting shell-forming species",
        last_updated: "2024-01-09"
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
        affected_species: ["Mackerel", "Haddock", "Herring", "Whiting"],
        description: "Commercial fishing pressure",
        last_updated: "2024-01-15"
      },
      {
        id: "ie-plastic-1",
        type: "pollution",
        severity: "medium",
        trend: "decreasing",
        impact: 45,
        affected_species: ["Dolphins", "Seabirds", "Harbor porpoises", "Minke whales"],
        description: "Marine litter reduction efforts showing progress",
        last_updated: "2024-01-12"
      },
      {
        id: "ie-salmon-1",
        type: "overfishing",
        severity: "high",
        trend: "increasing",
        impact: 75,
        affected_species: ["Atlantic salmon", "Sea trout", "Celtic sea bass"],
        description: "Salmon farming affecting wild populations",
        last_updated: "2024-01-13"
      },
      {
        id: "ie-climate-1",
        type: "climate",
        severity: "medium",
        trend: "increasing",
        impact: 55,
        affected_species: ["Basking sharks", "Puffins", "Storm petrels"],
        description: "Changing ocean currents affecting species distribution",
        last_updated: "2024-01-14"
      },
      {
        id: "ie-coastal-1",
        type: "coastal",
        severity: "medium",
        trend: "stable",
        impact: 40,
        affected_species: ["Kelp forests", "Seabirds", "Coastal fish"],
        description: "Coastal erosion affecting marine habitats",
        last_updated: "2024-01-11"
      },
      {
        id: "ie-invasive-1",
        type: "invasive",
        severity: "low",
        trend: "increasing",
        impact: 35,
        affected_species: ["Carpet sea squirt", "Native filter feeders"],
        description: "Invasive tunicate species spreading",
        last_updated: "2024-01-10"
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
        affected_species: ["Native shellfish", "Seaweed", "Caulerpa taxifolia", "Asian shore crab"],
        description: "Invasive species from shipping",
        last_updated: "2024-01-09"
      },
      {
        id: "fr-pollution-1",
        type: "pollution",
        severity: "high",
        trend: "stable",
        impact: 65,
        affected_species: ["Mediterranean fish", "Coastal birds", "Sea grass", "Dolphins"],
        description: "Agricultural runoff and industrial pollution",
        last_updated: "2024-01-14"
      },
      {
        id: "fr-tourism-1",
        type: "coastal",
        severity: "high",
        trend: "increasing",
        impact: 70,
        affected_species: ["Posidonia meadows", "Mediterranean monk seal", "Loggerhead turtles"],
        description: "Mass tourism pressuring coastal ecosystems",
        last_updated: "2024-01-12"
      },
      {
        id: "fr-fishing-1",
        type: "overfishing",
        severity: "medium",
        trend: "stable",
        impact: 55,
        affected_species: ["Bluefin tuna", "European sea bass", "Sole", "Anchovy"],
        description: "Commercial fishing in Atlantic and Mediterranean",
        last_updated: "2024-01-15"
      },
      {
        id: "fr-climate-1",
        type: "climate",
        severity: "high",
        trend: "increasing",
        impact: 75,
        affected_species: ["Coral reefs", "Endemic Mediterranean species", "Cold-water corals"],
        description: "Mediterranean warming faster than global average",
        last_updated: "2024-01-13"
      },
      {
        id: "fr-plastic-1",
        type: "pollution",
        severity: "medium",
        trend: "stable",
        impact: 50,
        affected_species: ["Seabirds", "Marine turtles", "Cetaceans"],
        description: "Plastic debris from major river systems",
        last_updated: "2024-01-11"
      },
      {
        id: "fr-shipping-1",
        type: "pollution",
        severity: "medium",
        trend: "stable",
        impact: 45,
        affected_species: ["Sperm whales", "Pilot whales", "Striped dolphins"],
        description: "Heavy shipping traffic in Mediterranean corridors",
        last_updated: "2024-01-10"
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
        affected_species: ["Mediterranean fish", "Coral communities", "Red coral", "Gorgonians"],
        description: "Rising sea temperatures in Mediterranean",
        last_updated: "2024-01-11"
      },
      {
        id: "es-fish-1",
        type: "overfishing",
        severity: "medium",
        trend: "stable",
        impact: 50,
        affected_species: ["Bluefin tuna", "Sardines", "Anchovies", "European hake"],
        description: "Commercial fishing pressure",
        last_updated: "2024-01-16"
      },
      {
        id: "es-coastal-1",
        type: "coastal",
        severity: "high",
        trend: "increasing",
        impact: 70,
        affected_species: ["Posidonia seagrass", "Coastal fish", "Mediterranean monk seal", "Loggerhead turtles"],
        description: "Tourism development on coastlines",
        last_updated: "2024-01-08"
      },
      {
        id: "es-pollution-1",
        type: "pollution",
        severity: "high",
        trend: "stable",
        impact: 65,
        affected_species: ["Striped dolphins", "Pilot whales", "Fin whales"],
        description: "Industrial and urban pollution in Mediterranean",
        last_updated: "2024-01-14"
      },
      {
        id: "es-invasive-1",
        type: "invasive",
        severity: "medium",
        trend: "increasing",
        impact: 55,
        affected_species: ["Caulerpa cylindracea", "Native seaweed", "Benthic communities"],
        description: "Invasive algae spreading in Mediterranean",
        last_updated: "2024-01-12"
      },
      {
        id: "es-acidification-1",
        type: "acidification",
        severity: "medium",
        trend: "increasing",
        impact: 50,
        affected_species: ["Mussels", "Sea urchins", "Calcifying plankton"],
        description: "Ocean acidification affecting shell-forming organisms",
        last_updated: "2024-01-13"
      },
      {
        id: "es-shipping-1",
        type: "pollution",
        severity: "medium",
        trend: "stable",
        impact: 45,
        affected_species: ["Sperm whales", "Cuvier's beaked whales", "Risso's dolphins"],
        description: "Heavy maritime traffic in shipping lanes",
        last_updated: "2024-01-15"
      },
      {
        id: "es-aquaculture-1",
        type: "coastal",
        severity: "medium",
        trend: "increasing",
        impact: 40,
        affected_species: ["Wild fish", "Seagrass beds", "Coastal ecosystems"],
        description: "Intensive aquaculture affecting coastal environments",
        last_updated: "2024-01-10"
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
        affected_species: ["Sardines", "Octopus", "Mackerel", "Horse mackerel"],
        description: "Intensive fishing in Atlantic waters",
        last_updated: "2024-01-13"
      },
      {
        id: "pt-climate-1",
        type: "climate",
        severity: "medium",
        trend: "increasing",
        impact: 55,
        affected_species: ["Tuna", "Sea turtles", "Loggerhead turtles", "Leatherback turtles"],
        description: "Ocean warming affecting migration patterns",
        last_updated: "2024-01-10"
      },
      {
        id: "pt-upwelling-1",
        type: "climate",
        severity: "high",
        trend: "increasing",
        impact: 70,
        affected_species: ["Sardines", "Anchovies", "Coastal fish", "Seabirds"],
        description: "Changes in upwelling patterns affecting productivity",
        last_updated: "2024-01-15"
      },
      {
        id: "pt-coastal-1",
        type: "coastal",
        severity: "medium",
        trend: "increasing",
        impact: 50,
        affected_species: ["Rocky shore species", "Kelp forests", "Coastal birds"],
        description: "Coastal development and erosion",
        last_updated: "2024-01-12"
      },
      {
        id: "pt-pollution-1",
        type: "pollution",
        severity: "medium",
        trend: "stable",
        impact: 45,
        affected_species: ["Dolphins", "Whales", "Seabirds"],
        description: "River pollution affecting coastal waters",
        last_updated: "2024-01-14"
      },
      {
        id: "pt-invasive-1",
        type: "invasive",
        severity: "medium",
        trend: "increasing",
        impact: 40,
        affected_species: ["Asian date mussel", "Native bivalves"],
        description: "Invasive mollusks competing with native species",
        last_updated: "2024-01-11"
      },
      {
        id: "pt-aquaculture-1",
        type: "coastal",
        severity: "low",
        trend: "increasing",
        impact: 35,
        affected_species: ["Wild salmon", "Sea bream", "Sea bass"],
        description: "Fish farming escapes affecting wild populations",
        last_updated: "2024-01-16"
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
        affected_species: ["Wadden Sea life", "Coastal birds", "Harbor seals", "Gray seals"],
        description: "Sea level rise threatening coastal ecosystems",
        last_updated: "2024-01-12"
      },
      {
        id: "nl-pollution-1",
        type: "pollution",
        severity: "medium",
        trend: "decreasing",
        impact: 40,
        affected_species: ["Harbor seals", "Harbor porpoises", "Common eider"],
        description: "Industrial pollution reduction efforts",
        last_updated: "2024-01-15"
      },
      {
        id: "nl-fishing-1",
        type: "overfishing",
        severity: "high",
        trend: "stable",
        impact: 75,
        affected_species: ["Sole", "Plaice", "Cod", "Whiting", "Bottom fish"],
        description: "Intensive bottom trawling in North Sea",
        last_updated: "2024-01-13"
      },
      {
        id: "nl-wind-farms-1",
        type: "coastal",
        severity: "medium",
        trend: "increasing",
        impact: 50,
        affected_species: ["Seabirds", "Marine mammals", "Fish migrations"],
        description: "Large-scale offshore wind farm development",
        last_updated: "2024-01-14"
      },
      {
        id: "nl-nitrogen-1",
        type: "pollution",
        severity: "high",
        trend: "stable",
        impact: 70,
        affected_species: ["Wadden Sea filter feeders", "Shellfish", "Seagrass"],
        description: "Agricultural nitrogen affecting marine ecosystems",
        last_updated: "2024-01-11"
      },
      {
        id: "nl-invasive-1",
        type: "invasive",
        severity: "medium",
        trend: "increasing",
        impact: 45,
        affected_species: ["Japanese oyster", "Native oyster beds"],
        description: "Invasive Pacific oysters dominating shellfish beds",
        last_updated: "2024-01-16"
      },
      {
        id: "nl-shipping-1",
        type: "pollution",
        severity: "medium",
        trend: "stable",
        impact: 55,
        affected_species: ["Harbor porpoises", "Seals", "Migratory fish"],
        description: "Heavy shipping traffic in major ports",
        last_updated: "2024-01-10"
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
        affected_species: ["Marine mammals", "Seabirds", "Harbor porpoises", "Gray seals"],
        description: "Heavy shipping traffic pollution",
        last_updated: "2024-01-14"
      },
      {
        id: "be-fishing-1",
        type: "overfishing",
        severity: "medium",
        trend: "stable",
        impact: 60,
        affected_species: ["Sole", "Plaice", "Cod", "Whiting"],
        description: "Intensive beam trawling in North Sea",
        last_updated: "2024-01-13"
      },
      {
        id: "be-sand-extraction-1",
        type: "coastal",
        severity: "medium",
        trend: "increasing",
        impact: 55,
        affected_species: ["Benthic fauna", "Fish nurseries", "Sandeel"],
        description: "Marine sand extraction affecting seafloor",
        last_updated: "2024-01-12"
      },
      {
        id: "be-pollution-2",
        type: "pollution",
        severity: "medium",
        trend: "decreasing",
        impact: 50,
        affected_species: ["Shellfish", "Coastal fish", "Marine invertebrates"],
        description: "Chemical pollution from industrial sources",
        last_updated: "2024-01-15"
      },
      {
        id: "be-climate-1",
        type: "climate",
        severity: "medium",
        trend: "increasing",
        impact: 45,
        affected_species: ["North Sea fish", "Migratory species"],
        description: "Changing water temperatures affecting species distribution",
        last_updated: "2024-01-11"
      },
      {
        id: "be-invasive-1",
        type: "invasive",
        severity: "low",
        trend: "increasing",
        impact: 35,
        affected_species: ["American razor clam", "Native bivalves"],
        description: "Invasive mollusks establishing populations",
        last_updated: "2024-01-16"
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
        affected_species: ["Baltic fish", "Marine birds", "Harbor seals", "Gray seals"],
        description: "Agricultural runoff in Baltic Sea",
        last_updated: "2024-01-11"
      },
      {
        id: "de-wind-1",
        type: "coastal",
        severity: "low",
        trend: "increasing",
        impact: 30,
        affected_species: ["Marine mammals", "Seabirds", "Fish migrations"],
        description: "Offshore wind farm development",
        last_updated: "2024-01-16"
      },
      {
        id: "de-fishing-1",
        type: "overfishing",
        severity: "medium",
        trend: "stable",
        impact: 65,
        affected_species: ["Cod", "Herring", "Sprat", "Flounder"],
        description: "Commercial fishing in North and Baltic Seas",
        last_updated: "2024-01-14"
      },
      {
        id: "de-shipping-1",
        type: "pollution",
        severity: "medium",
        trend: "stable",
        impact: 50,
        affected_species: ["Harbor porpoises", "Seals", "Migratory fish"],
        description: "Heavy shipping traffic in major ports",
        last_updated: "2024-01-13"
      },
      {
        id: "de-invasive-1",
        type: "invasive",
        severity: "medium",
        trend: "increasing",
        impact: 45,
        affected_species: ["Round goby", "Native fish species"],
        description: "Invasive fish species from ballast water",
        last_updated: "2024-01-12"
      },
      {
        id: "de-climate-1",
        type: "climate",
        severity: "medium",
        trend: "increasing",
        impact: 60,
        affected_species: ["Cold-water species", "Arctic migrants"],
        description: "Warming seas affecting northern species",
        last_updated: "2024-01-15"
      },
      {
        id: "de-acidification-1",
        type: "acidification",
        severity: "medium",
        trend: "increasing",
        impact: 40,
        affected_species: ["Mussels", "Barnacles", "Calcifying plankton"],
        description: "Ocean acidification in North Sea",
        last_updated: "2024-01-10"
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
        affected_species: ["Shellfish", "Coral", "Red coral", "Mediterranean mussels"],
        description: "Ocean acidification in Mediterranean",
        last_updated: "2024-01-08"
      },
      {
        id: "it-pollution-1",
        type: "pollution",
        severity: "high",
        trend: "stable",
        impact: 70,
        affected_species: ["Dolphins", "Sea turtles", "Sperm whales", "Fin whales"],
        description: "Plastic and chemical pollution",
        last_updated: "2024-01-12"
      },
      {
        id: "it-fishing-1",
        type: "overfishing",
        severity: "high",
        trend: "stable",
        impact: 80,
        affected_species: ["Bluefin tuna", "Swordfish", "European anchovy", "Sardines"],
        description: "Intensive fishing depleting Mediterranean stocks",
        last_updated: "2024-01-15"
      },
      {
        id: "it-tourism-1",
        type: "coastal",
        severity: "high",
        trend: "increasing",
        impact: 85,
        affected_species: ["Posidonia meadows", "Coastal fish", "Loggerhead turtles"],
        description: "Mass tourism destroying coastal habitats",
        last_updated: "2024-01-13"
      },
      {
        id: "it-climate-1",
        type: "climate",
        severity: "critical",
        trend: "increasing",
        impact: 90,
        affected_species: ["Mediterranean endemic species", "Cold-water corals", "Deep-sea fish"],
        description: "Rapid Mediterranean warming and marine heatwaves",
        last_updated: "2024-01-11"
      },
      {
        id: "it-invasive-1",
        type: "invasive",
        severity: "medium",
        trend: "increasing",
        impact: 55,
        affected_species: ["Caulerpa racemosa", "Native algae", "Benthic communities"],
        description: "Invasive species from Suez Canal and shipping",
        last_updated: "2024-01-14"
      },
      {
        id: "it-shipping-1",
        type: "pollution",
        severity: "medium",
        trend: "stable",
        impact: 60,
        affected_species: ["Cetaceans", "Seabirds", "Marine mammals"],
        description: "Heavy maritime traffic in Mediterranean corridors",
        last_updated: "2024-01-16"
      },
      {
        id: "it-aquaculture-1",
        type: "coastal",
        severity: "medium",
        trend: "increasing",
        impact: 50,
        affected_species: ["Wild fish", "Seagrass beds", "Benthic fauna"],
        description: "Intensive aquaculture affecting coastal waters",
        last_updated: "2024-01-10"
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
        affected_species: ["Posidonia meadows", "Mediterranean monk seal", "Caretta caretta turtles"],
        description: "Tourism pressure on coastal ecosystems",
        last_updated: "2024-01-09"
      },
      {
        id: "gr-fishing-1",
        type: "overfishing",
        severity: "medium",
        trend: "stable",
        impact: 60,
        affected_species: ["Mediterranean fish", "Octopus", "Red mullet", "Sea bream"],
        description: "Traditional and commercial fishing pressure",
        last_updated: "2024-01-13"
      },
      {
        id: "gr-climate-1",
        type: "climate",
        severity: "high",
        trend: "increasing",
        impact: 75,
        affected_species: ["Coral communities", "Endemic fish", "Aegean Sea species"],
        description: "Mediterranean warming and marine heatwaves",
        last_updated: "2024-01-10"
      },
      {
        id: "gr-pollution-1",
        type: "pollution",
        severity: "medium",
        trend: "stable",
        impact: 65,
        affected_species: ["Dolphins", "Seabirds", "Coastal fish"],
        description: "Plastic pollution and sewage discharge",
        last_updated: "2024-01-14"
      },
      {
        id: "gr-shipping-1",
        type: "pollution",
        severity: "medium",
        trend: "stable",
        impact: 55,
        affected_species: ["Sperm whales", "Striped dolphins", "Cuvier's beaked whales"],
        description: "Major shipping routes through Greek waters",
        last_updated: "2024-01-12"
      },
      {
        id: "gr-invasive-1",
        type: "invasive",
        severity: "medium",
        trend: "increasing",
        impact: 50,
        affected_species: ["Lessepsian migrants", "Native Mediterranean species"],
        description: "Red Sea species invading through Suez Canal",
        last_updated: "2024-01-11"
      },
      {
        id: "gr-acidification-1",
        type: "acidification",
        severity: "medium",
        trend: "increasing",
        impact: 45,
        affected_species: ["Shellfish", "Sea urchins", "Calcifying organisms"],
        description: "Ocean acidification affecting marine calcifiers",
        last_updated: "2024-01-15"
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
        affected_species: ["Green turtles", "Loggerhead turtles", "Posidonia seagrass", "Mediterranean monk seal"],
        description: "Extreme heat affecting nesting beaches and marine life",
        last_updated: "2024-01-11"
      },
      {
        id: "cy-coastal-1",
        type: "coastal",
        severity: "medium",
        trend: "increasing",
        impact: 65,
        affected_species: ["Coastal fish", "Marine vegetation", "Endemic cyprinids"],
        description: "Tourism development on coastlines",
        last_updated: "2024-01-14"
      },
      {
        id: "cy-pollution-1",
        type: "pollution",
        severity: "medium",
        trend: "stable",
        impact: 55,
        affected_species: ["Mediterranean fish", "Cetaceans", "Seabirds"],
        description: "Land-based pollution affecting coastal waters",
        last_updated: "2024-01-13"
      },
      {
        id: "cy-fishing-1",
        type: "overfishing",
        severity: "medium",
        trend: "stable",
        impact: 50,
        affected_species: ["Sea bream", "Grouper", "Red mullet"],
        description: "Small-scale but intensive fishing around island",
        last_updated: "2024-01-12"
      },
      {
        id: "cy-invasive-1",
        type: "invasive",
        severity: "medium",
        trend: "increasing",
        impact: 45,
        affected_species: ["Lessepsian migrants", "Native fish", "Indo-Pacific species"],
        description: "Red Sea species invasion through Suez Canal",
        last_updated: "2024-01-15"
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
        affected_species: ["Bluefin tuna", "Swordfish", "Dolphinfish", "Atlantic bluefin"],
        description: "Intensive fishing around small island depleting stocks",
        last_updated: "2024-01-12"
      },
      {
        id: "mt-development-1",
        type: "coastal",
        severity: "medium",
        trend: "increasing",
        impact: 70,
        affected_species: ["Endemic fish", "Rocky shore life", "Mediterranean starfish"],
        description: "Limited coastline under development pressure",
        last_updated: "2024-01-15"
      },
      {
        id: "mt-pollution-1",
        type: "pollution",
        severity: "medium",
        trend: "stable",
        impact: 60,
        affected_species: ["Seabirds", "Marine turtles", "Dolphins"],
        description: "Marine litter and sewage in small island waters",
        last_updated: "2024-01-14"
      },
      {
        id: "mt-aquaculture-1",
        type: "coastal",
        severity: "high",
        trend: "increasing",
        impact: 75,
        affected_species: ["Wild tuna", "Benthic communities", "Native fish"],
        description: "Intensive tuna farming in limited coastal space",
        last_updated: "2024-01-13"
      },
      {
        id: "mt-climate-1",
        type: "climate",
        severity: "high",
        trend: "increasing",
        impact: 70,
        affected_species: ["Subtropical fish", "Endemic species", "Coral communities"],
        description: "Rapid Mediterranean warming affecting island ecosystems",
        last_updated: "2024-01-11"
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
        affected_species: ["Adriatic fish", "Seagrass beds", "Bottlenose dolphins", "Loggerhead turtles"],
        description: "Massive tourism growth impacting Adriatic coast",
        last_updated: "2024-01-13"
      },
      {
        id: "hr-pollution-1",
        type: "pollution",
        severity: "medium",
        trend: "stable",
        impact: 50,
        affected_species: ["Dolphins", "Sea turtles", "Adriatic sturgeon", "Brown meagre"],
        description: "Marine litter and wastewater issues",
        last_updated: "2024-01-10"
      },
      {
        id: "hr-fishing-1",
        type: "overfishing",
        severity: "medium",
        trend: "stable",
        impact: 55,
        affected_species: ["European pilchard", "Anchovy", "Adriatic hake"],
        description: "Commercial fishing pressure in Adriatic",
        last_updated: "2024-01-14"
      },
      {
        id: "hr-invasive-1",
        type: "invasive",
        severity: "low",
        trend: "increasing",
        impact: 35,
        affected_species: ["Blue crab", "Native crustaceans"],
        description: "Invasive species establishing in Adriatic waters",
        last_updated: "2024-01-12"
      },
      {
        id: "hr-climate-1",
        type: "climate",
        severity: "medium",
        trend: "increasing",
        impact: 45,
        affected_species: ["Cold-water fish", "Temperate species"],
        description: "Adriatic warming affecting fish distributions",
        last_updated: "2024-01-15"
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-4">
              <Waves className="h-8 w-8 text-primary-foreground animate-wave" />
              <h1 className="text-3xl font-bold text-primary-foreground">
                European Marine Threat Monitor
              </h1>
            </div>
            <Button
              onClick={() => window.location.href = '/donate'}
              variant="outline"
              className="bg-coral text-white border-coral hover:bg-coral/90 hover:text-white"
            >
              <Heart className="h-4 w-4 mr-2" />
              Support Conservation
            </Button>
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
