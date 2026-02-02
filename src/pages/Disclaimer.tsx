import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight, AlertTriangle, Info, TrendingDown, FileWarning,
  Search, ShieldAlert, UserCheck, Mail, AlertOctagon
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/landing/Footer";

const Disclaimer = () => {
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
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Avertissement et Clause de Non-Responsabilité</h1>
                <p className="text-muted-foreground">Information importante - Veuillez lire attentivement</p>
              </div>
            </div>
          </motion.div>

          {/* Warning Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-10 p-6 bg-amber-500/10 border-2 border-amber-500/30 rounded-xl"
            dir="ltr"
          >
            <div className="flex items-start gap-4">
              <AlertOctagon className="w-8 h-8 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-bold text-amber-500 mb-2">AVERTISSEMENT IMPORTANT</h2>
                <p className="text-foreground leading-relaxed uppercase text-sm">
                  LES INFORMATIONS FOURNIES SUR CE SITE WEB SONT UNIQUEMENT À DES FINS INFORMATIVES ET ÉDUCATIVES.
                  ELLES NE CONSTITUENT EN AUCUN CAS UN CONSEIL D'INVESTISSEMENT, UNE RECOMMANDATION D'ACHAT OU DE
                  VENTE, OU UNE OFFRE DE SERVICES FINANCIERS.
                </p>
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
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Info className="w-4 h-4 text-amber-500" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Nature des Informations</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                CasaBourse.ma fournit des données et des informations sur les actions cotées à la Bourse de
                Casablanca. Ces informations comprennent, sans s'y limiter :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Cours des actions et données historiques</li>
                <li>Indicateurs financiers et ratios</li>
                <li>Analyses comparatives d'entreprises</li>
                <li>Données sur les dividendes et la performance</li>
              </ul>
              <p className="text-muted-foreground italic">
                Ces informations sont fournies à titre indicatif uniquement et ne doivent pas être considérées
                comme des conseils d'investissement.
              </p>
            </section>

            {/* Section 2 */}
            <section className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Absence de Conseil en Investissement</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                CasaBourse.ma n'est pas :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Un conseiller en investissement agréé</li>
                <li>Un courtier en valeurs mobilières</li>
                <li>Un établissement financier réglementé</li>
                <li>Un prestataire de services de gestion de portefeuille</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed font-medium">
                Nous ne fournissons pas de conseils personnalisés en matière d'investissement. Toute décision
                d'investissement doit être prise après consultation d'un conseiller financier qualifié et agréé.
              </p>
            </section>

            {/* Section 3 - Risk Warning */}
            <section className="mb-10 p-6 bg-red-500/5 rounded-xl border-2 border-red-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Risques d'Investissement</h2>
              </div>
              <p className="text-red-500 font-bold mb-4">
                INVESTIR EN BOURSE COMPORTE DES RISQUES IMPORTANTS :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong className="text-foreground">Vous pouvez perdre tout ou partie de votre capital investi</strong></li>
                <li>Les performances passées ne garantissent pas les résultats futurs</li>
                <li>Les marchés financiers sont volatils et imprévisibles</li>
                <li>Les investissements peuvent être affectés par des facteurs économiques, politiques et sociaux</li>
                <li>La valeur des investissements peut fluctuer considérablement</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <FileWarning className="w-4 h-4 text-amber-500" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Exactitude des Données</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Bien que nous nous efforcions de fournir des informations exactes et à jour :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Nous ne garantissons pas l'exactitude, l'exhaustivité ou l'actualité de toutes les données</li>
                <li>Les données peuvent être sujettes à des retards, des erreurs ou des omissions</li>
                <li>Les informations proviennent de sources tierces et peuvent contenir des inexactitudes</li>
                <li>Nous ne sommes pas responsables des erreurs dans les données fournies</li>
              </ul>
              <p className="text-muted-foreground italic">
                Vous devez toujours vérifier les informations auprès de sources officielles et de professionnels
                qualifiés avant de prendre toute décision d'investissement.
              </p>
            </section>

            {/* Section 5 */}
            <section className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Limitation de Responsabilité</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                CasaBourse.ma décline toute responsabilité pour :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Les pertes financières résultant de décisions d'investissement prises sur la base des informations du site</li>
                <li>Les erreurs, inexactitudes ou omissions dans les données fournies</li>
                <li>Les interruptions de service ou problèmes techniques</li>
                <li>Les dommages directs, indirects, accessoires ou consécutifs</li>
                <li>Tout préjudice résultant de l'utilisation ou de l'impossibilité d'utiliser le site</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Search className="w-4 h-4 text-amber-500" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Faire Vos Propres Recherches</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Avant de prendre toute décision d'investissement, vous devez :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Effectuer vos propres recherches approfondies</li>
                <li>Consulter un conseiller financier professionnel et agréé</li>
                <li>Comprendre pleinement les risques associés aux investissements</li>
                <li>Évaluer votre tolérance au risque et vos objectifs financiers</li>
                <li><strong className="text-foreground">Ne jamais investir plus que ce que vous pouvez vous permettre de perdre</strong></li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Conformité Réglementaire</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Bourse Maroc n'est pas soumis à la réglementation de :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>L'Autorité Marocaine du Marché des Capitaux (AMMC)</li>
                <li>Bank Al-Maghrib</li>
                <li>Toute autre autorité de régulation financière</li>
              </ul>
              <p className="text-muted-foreground italic">
                Pour obtenir des conseils en investissement réglementés, veuillez consulter un professionnel
                agréé par les autorités compétentes.
              </p>
            </section>

            {/* Section 8 - User Acknowledgment */}
            <section className="mb-10 p-6 bg-amber-500/5 rounded-xl border-2 border-amber-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <UserCheck className="w-4 h-4 text-amber-500" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Utilisation à Vos Propres Risques</h2>
              </div>
              <p className="text-foreground font-medium mb-4">
                EN UTILISANT CE SITE, VOUS RECONNAISSEZ ET ACCEPTEZ QUE :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Vous utilisez les informations et services à vos propres risques</li>
                <li>Vous êtes seul responsable de vos décisions d'investissement</li>
                <li>Vous acceptez les risques inhérents aux investissements en bourse</li>
                <li>Vous avez lu et compris cet avertissement dans son intégralité</li>
              </ul>
            </section>

            {/* Important Reminder */}
            <section className="mb-10 p-6 bg-primary/5 rounded-xl border border-primary/20">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary mb-2">Rappel Important</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Si vous avez des doutes ou des questions concernant un investissement, consultez toujours un
                    conseiller financier professionnel avant de prendre une décision. Ne vous fiez jamais uniquement
                    aux informations trouvées en ligne, y compris sur notre site.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="p-6 bg-gradient-to-br from-amber-500/5 to-amber-500/10 rounded-xl border border-amber-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-amber-500" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Contact</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Pour toute question concernant cet avertissement, veuillez nous contacter à :
              </p>
              <p className="text-foreground">
                <strong>Email :</strong>{" "}
                <a href="mailto:contact@casabourse.ma" className="text-amber-500 hover:underline">
                  contact@casabourse.ma
                </a>
              </p>
            </section>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Disclaimer;
