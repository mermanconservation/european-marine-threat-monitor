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
  Minus
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
}

const europeanCountries: CountryData[] = [
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
    coastline_length: 25148
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
      }
    ],
    overall_risk: 45,
    marine_protected_areas: 12,
    coastline_length: 4970
  },
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
      }
    ],
    overall_risk: 65,
    marine_protected_areas: 8,
    coastline_length: 12429
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
      }
    ],
    overall_risk: 58,
    marine_protected_areas: 18,
    coastline_length: 4964
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
      }
    ],
    overall_risk: 52,
    marine_protected_areas: 22,
    coastline_length: 3427
  },
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
      }
    ],
    overall_risk: 63,
    marine_protected_areas: 16,
    coastline_length: 7600
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
            Real-time monitoring of marine environmental threats across European waters
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="threats">Threats ({country.threats.length})</TabsTrigger>
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