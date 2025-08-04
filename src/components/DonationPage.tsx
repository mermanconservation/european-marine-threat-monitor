import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Heart,
  CreditCard,
  Building2,
  Fish,
  Waves,
  Shield,
  Copy,
  ExternalLink,
  CheckCircle,
  ArrowLeft
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function DonationPage() {
  const navigate = useNavigate();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const bankDetails = {
    accountHolder: "Christos Taklis",
    bank: "Wise (formerly TransferWise)",
    iban: "GB28 TRWI 2314 7048 2178 15",
    bic: "TRWIGB2LXXX",
    reference: "Donation + Your Name"
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <div className="bg-gradient-ocean border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Heart className="h-10 w-10 text-coral animate-pulse-glow" />
              <h1 className="text-4xl font-bold text-primary-foreground">
                Support Marine Conservation
              </h1>
            </div>
            <p className="text-xl text-primary-foreground/90 mb-6">
              Help protect our oceans and marine life for future generations
            </p>
            <div className="flex items-center justify-center gap-6 text-primary-foreground/80">
              <div className="flex items-center gap-2">
                <Fish className="h-5 w-5" />
                <span>Protect Marine Life</span>
              </div>
              <div className="flex items-center gap-2">
                <Waves className="h-5 w-5" />
                <span>Clean Our Oceans</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span>Conservation Research</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center shadow-card-ocean border-l-4 border-l-coral">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-coral mb-2">2,500+</div>
              <p className="text-muted-foreground">Marine Animals Protected</p>
            </CardContent>
          </Card>
          <Card className="text-center shadow-card-ocean border-l-4 border-l-accent">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-accent mb-2">15</div>
              <p className="text-muted-foreground">Protected Marine Areas</p>
            </CardContent>
          </Card>
          <Card className="text-center shadow-card-ocean border-l-4 border-l-seaweed">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-seaweed mb-2">50km²</div>
              <p className="text-muted-foreground">Ocean Habitat Restored</p>
            </CardContent>
          </Card>
        </div>

        {/* Donation Methods */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Choose Your Donation Method</h2>
            <p className="text-lg text-muted-foreground">
              Every contribution makes a difference in protecting our marine ecosystems
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stripe Card Payment */}
            <Card className="shadow-card-ocean hover:shadow-ocean transition-all duration-300 group border-l-4 border-l-primary">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Credit/Debit Card</CardTitle>
                <CardDescription>
                  Secure payment via Stripe
                </CardDescription>
                <Badge variant="outline" className="mx-auto w-fit">Most Popular</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Fast, secure, and instant processing
                  </p>
                </div>
                <Button 
                  onClick={() => window.open('https://buy.stripe.com/3cIbIUgvx6zmaTjdIPco000', '_blank')}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="lg"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Donate with Card
                </Button>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  <span>Secured by Stripe</span>
                </div>
              </CardContent>
            </Card>

            {/* PayPal */}
            <Card className="shadow-card-ocean hover:shadow-ocean transition-all duration-300 group border-l-4 border-l-accent">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-accent/10 rounded-full w-fit">
                  <div className="h-8 w-8 bg-accent rounded text-accent-foreground flex items-center justify-center font-bold text-sm">
                    PP
                  </div>
                </div>
                <CardTitle className="text-xl">PayPal</CardTitle>
                <CardDescription>
                  Pay with your PayPal account
                </CardDescription>
                <Badge variant="secondary" className="mx-auto w-fit">Quick & Easy</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Use your existing PayPal account
                  </p>
                </div>
                <Button 
                  onClick={() => window.open('https://www.paypal.com/paypalme/mermanconservation', '_blank')}
                  variant="outline"
                  className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                  size="lg"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Donate via PayPal
                </Button>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  <span>PayPal Buyer Protection</span>
                </div>
              </CardContent>
            </Card>

            {/* Bank Transfer */}
            <Card className="shadow-card-ocean hover:shadow-ocean transition-all duration-300 group border-l-4 border-l-seaweed">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-seaweed/10 rounded-full w-fit">
                  <Building2 className="h-8 w-8 text-seaweed" />
                </div>
                <CardTitle className="text-xl">Bank Transfer</CardTitle>
                <CardDescription>
                  Direct bank transfer (SEPA)
                </CardDescription>
                <Badge variant="secondary" className="mx-auto w-fit">No Fees</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Account Holder</p>
                        <p className="font-medium text-sm">{bankDetails.accountHolder}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(bankDetails.accountHolder, 'accountHolder')}
                        className="h-8 w-8 p-0"
                      >
                        {copiedField === 'accountHolder' ? 
                          <CheckCircle className="h-3 w-3 text-green-600" /> : 
                          <Copy className="h-3 w-3" />
                        }
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Bank</p>
                        <p className="font-medium text-sm">{bankDetails.bank}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(bankDetails.bank, 'bank')}
                        className="h-8 w-8 p-0"
                      >
                        {copiedField === 'bank' ? 
                          <CheckCircle className="h-3 w-3 text-green-600" /> : 
                          <Copy className="h-3 w-3" />
                        }
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">IBAN</p>
                        <p className="font-medium text-sm font-mono">{bankDetails.iban}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(bankDetails.iban, 'iban')}
                        className="h-8 w-8 p-0"
                      >
                        {copiedField === 'iban' ? 
                          <CheckCircle className="h-3 w-3 text-green-600" /> : 
                          <Copy className="h-3 w-3" />
                        }
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">BIC/SWIFT</p>
                        <p className="font-medium text-sm font-mono">{bankDetails.bic}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(bankDetails.bic, 'bic')}
                        className="h-8 w-8 p-0"
                      >
                        {copiedField === 'bic' ? 
                          <CheckCircle className="h-3 w-3 text-green-600" /> : 
                          <Copy className="h-3 w-3" />
                        }
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                    <p className="text-xs text-muted-foreground mb-1">Reference</p>
                    <p className="font-medium text-sm text-accent">{bankDetails.reference}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Information */}
        <div className="max-w-2xl mx-auto mt-12">
          <Card className="shadow-card-ocean">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Heart className="h-5 w-5 text-coral" />
                Your Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-coral/10 rounded-full flex items-center justify-center">
                    <span className="text-coral font-bold">€25</span>
                  </div>
                  <span>Protects 1 sea turtle nesting site</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                    <span className="text-accent font-bold">€50</span>
                  </div>
                  <span>Funds 1 week of research</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-seaweed/10 rounded-full flex items-center justify-center">
                    <span className="text-seaweed font-bold">€100</span>
                  </div>
                  <span>Supports 1 month of conservation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">€250</span>
                  </div>
                  <span>Sponsors marine equipment</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="text-center text-sm text-muted-foreground">
                <p>All donations go directly to marine conservation efforts.</p>
                <p className="mt-1">Tax-deductible receipts available upon request.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}