import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Scale, Shield, FileText, AlertTriangle, Globe, RefreshCw, Mail } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/landing/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowRight className="w-4 h-4" />
              العودة إلى الصفحة الرئيسية
            </Link>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Scale className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Conditions d'Utilisation</h1>
                <p className="text-muted-foreground">Dernière mise à jour : 02/02/2026</p>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="prose prose-slate dark:prose-invert max-w-none"
            dir="ltr"
          >
            {/* Section 1 */}
            <section className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Acceptation des Conditions</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                En accédant et en utilisant CasaBourse.ma, vous acceptez d'être lié par ces Conditions d'Utilisation.
                Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site.
              </p>
            </section>

            {/* Section 2 */}
            <section className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Description du Service</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                CasaBourse.ma fournit des informations et des données sur les actions cotées à la Bourse de Casablanca.
                Notre service comprend :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Données en temps réel et historiques sur les actions</li>
                <li>Analyses et comparaisons d'entreprises</li>
                <li>Outils de visualisation et de filtrage</li>
                <li>Informations financières et indicateurs de performance</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Utilisation Acceptable</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">Vous acceptez de :</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Utiliser le site uniquement à des fins légales</li>
                <li>Ne pas tenter d'accéder de manière non autorisée à nos systèmes</li>
                <li>Ne pas copier, reproduire ou redistribuer notre contenu sans autorisation</li>
                <li>Ne pas utiliser le site d'une manière qui pourrait l'endommager ou affecter sa disponibilité</li>
                <li>Ne pas utiliser de robots, scrapers ou autres moyens automatisés pour accéder au site</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Droits de Propriété Intellectuelle</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Tout le contenu présent sur CasaBourse.ma, y compris mais sans s'y limiter, les textes, graphiques,
                logos, images, données financières et logiciels, est la propriété de CasaBourse.ma ou de ses fournisseurs
                de contenu et est protégé par les lois marocaines et internationales sur la propriété intellectuelle.
              </p>
            </section>

            {/* Section 5 */}
            <section className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Exactitude des Informations</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Bien que nous nous efforcions de fournir des informations exactes et à jour, nous ne garantissons pas
                l'exactitude, l'exhaustivité ou l'actualité de toutes les informations sur le site. Les données
                financières peuvent être sujettes à des retards ou des erreurs.
              </p>
            </section>

            {/* Section 6 */}
            <section className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Limitation de Responsabilité</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Dans toute la mesure permise par la loi applicable :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>CasaBourse.ma ne sera pas responsable des dommages directs, indirects, accessoires, spéciaux ou
                    consécutifs résultant de l'utilisation ou de l'impossibilité d'utiliser le site</li>
                <li>Nous ne sommes pas responsables des décisions d'investissement prises sur la base des informations
                    fournies sur notre site</li>
                <li>Le site est fourni "tel quel" sans garantie d'aucune sorte</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">7</span>
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Comptes Utilisateurs</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Si vous créez un compte sur CasaBourse.ma :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Vous êtes responsable de la confidentialité de vos identifiants</li>
                <li>Vous êtes responsable de toutes les activités effectuées sous votre compte</li>
                <li>Vous devez nous informer immédiatement de toute utilisation non autorisée de votre compte</li>
                <li>Nous nous réservons le droit de suspendre ou de résilier les comptes qui violent ces conditions</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Liens Externes</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Notre site peut contenir des liens vers des sites web tiers. Nous n'avons aucun contrôle sur ces sites
                et ne sommes pas responsables de leur contenu, de leurs politiques de confidentialité ou de leurs pratiques.
              </p>
            </section>

            {/* Section 9 & 10 */}
            <section className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Modifications</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>Modifications du Service :</strong> Nous nous réservons le droit de modifier, suspendre ou
                interrompre tout ou partie du service à tout moment, avec ou sans préavis.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Modifications des Conditions :</strong> Nous pouvons réviser ces Conditions d'Utilisation à
                tout moment. La version la plus récente sera toujours disponible sur cette page. Votre utilisation
                continue du site après de telles modifications constitue votre acceptation des nouvelles conditions.
              </p>
            </section>

            {/* Section 11 */}
            <section className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Scale className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Loi Applicable</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Ces Conditions d'Utilisation sont régies par les lois du Royaume du Maroc. Tout litige sera soumis
                à la compétence exclusive des tribunaux de Casablanca.
              </p>
            </section>

            {/* Section 12 - Contact */}
            <section className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Contact</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Pour toute question concernant ces Conditions d'Utilisation, veuillez nous contacter à :
              </p>
              <div className="space-y-2">
                <p className="text-foreground">
                  <strong>Email :</strong>{" "}
                  <a href="mailto:contact@casabourse.ma" className="text-primary hover:underline">
                    contact@casabourse.ma
                  </a>
                </p>
                <p className="text-foreground">
                  <strong>Adresse :</strong> Casablanca Finance City, Casablanca, Maroc
                </p>
              </div>
            </section>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
