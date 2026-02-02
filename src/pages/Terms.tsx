import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Scale,
  Shield,
  FileText,
  AlertTriangle,
  Globe,
  RefreshCw,
  Mail,
  UserCheck,
  CreditCard,
  Clock,
  BookOpen,
  Gavel,
  Lock,
  Ban,
  Award,
  HelpCircle,
  CheckCircle,
  XCircle
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/landing/Footer";
import { Separator } from "@/components/ui/separator";

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

            {/* Quick Summary Box */}
            <div className="mt-6 p-6 bg-primary/5 rounded-xl border border-primary/20">
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Résumé
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Ces Conditions d'Utilisation régissent votre accès et utilisation de CasaBourse.ma.
                En utilisant notre plateforme, vous acceptez ces conditions dans leur intégralité.
                Nous vous recommandons de lire attentivement ce document.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Usage personnel</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Données informatives</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span>Pas de conseil financier</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span>Pas de garantie de profit</span>
                </div>
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
            {/* Table of Contents */}
            <section className="mb-10 p-6 bg-card rounded-xl border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4">Table des Matières</h2>
              <nav className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  "1. Acceptation des Conditions",
                  "2. Description du Service",
                  "3. Inscription et Compte Utilisateur",
                  "4. Utilisation Acceptable",
                  "5. Droits de Propriété Intellectuelle",
                  "6. Exactitude des Informations",
                  "7. Limitation de Responsabilité",
                  "8. Indemnisation",
                  "9. Abonnements et Paiements",
                  "10. Résiliation",
                  "11. Liens Externes",
                  "12. Protection des Données",
                  "13. Modifications",
                  "14. Règlement des Litiges",
                  "15. Dispositions Générales",
                  "16. Contact"
                ].map((item, index) => (
                  <a
                    key={index}
                    href={`#section-${index + 1}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </section>

            {/* Section 1 */}
            <section id="section-1" className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Acceptation des Conditions</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                En accédant et en utilisant CasaBourse.ma (ci-après "le Site" ou "la Plateforme"),
                vous acceptez d'être lié par ces Conditions d'Utilisation, notre Politique de
                Confidentialité et toutes les lois et réglementations applicables.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site.
                L'utilisation continue du Site après la publication de modifications des présentes
                conditions constitue votre acceptation de ces modifications.
              </p>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    <strong>Important :</strong> Ces conditions constituent un accord juridiquement
                    contraignant entre vous et CasaBourse.ma. Veuillez les lire attentivement avant
                    d'utiliser nos services.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section id="section-2" className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Description du Service</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                CasaBourse.ma est une plateforme d'information financière dédiée au marché boursier
                marocain. Nous fournissons des outils d'analyse, des données de marché et des
                informations sur les entreprises cotées à la Bourse de Casablanca.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>Notre service comprend :</strong>
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Données en temps réel et historiques sur les actions marocaines</li>
                <li>Analyses fondamentales et techniques des entreprises cotées</li>
                <li>Outils de screening et de filtrage des actions</li>
                <li>Informations sur les fonds d'investissement OPCVM</li>
                <li>Comparaisons sectorielles et benchmarking</li>
                <li>Indicateurs économiques du Maroc</li>
                <li>Actualités et analyses de marché</li>
                <li>Alertes personnalisées sur les prix et les événements</li>
              </ul>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Note :</strong> CasaBourse.ma ne fournit PAS de conseils en investissement.
                  Toutes les informations sont fournies à titre informatif uniquement.
                </p>
              </div>
            </section>

            {/* Section 3 - User Accounts */}
            <section id="section-3" className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <UserCheck className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Inscription et Compte Utilisateur</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Pour accéder à certaines fonctionnalités de CasaBourse.ma, vous devez créer un compte.
                Lors de l'inscription, vous vous engagez à :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Fournir des informations exactes, actuelles et complètes</li>
                <li>Mettre à jour vos informations pour les maintenir exactes</li>
                <li>Préserver la confidentialité de votre mot de passe</li>
                <li>Notifier immédiatement toute utilisation non autorisée de votre compte</li>
                <li>Être responsable de toutes les activités effectuées sous votre compte</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>Conditions d'éligibilité :</strong>
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Vous devez avoir au moins 18 ans pour créer un compte</li>
                <li>Un seul compte par personne est autorisé</li>
                <li>Les comptes d'entreprise doivent être créés par un représentant autorisé</li>
                <li>Nous nous réservons le droit de refuser ou de résilier tout compte</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section id="section-4" className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">4</span>
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Utilisation Acceptable</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>Vous acceptez de :</strong>
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Utiliser le site uniquement à des fins légales et personnelles</li>
                <li>Respecter les droits des autres utilisateurs</li>
                <li>Ne pas perturber le fonctionnement normal du site</li>
                <li>Signaler tout contenu inapproprié ou abusif</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>Il est strictement interdit de :</strong>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2 p-3 bg-red-500/5 rounded-lg border border-red-500/10">
                  <Ban className="w-4 h-4 text-red-500 mt-0.5" />
                  <span className="text-sm text-muted-foreground">Tenter d'accéder de manière non autorisée à nos systèmes</span>
                </div>
                <div className="flex items-start gap-2 p-3 bg-red-500/5 rounded-lg border border-red-500/10">
                  <Ban className="w-4 h-4 text-red-500 mt-0.5" />
                  <span className="text-sm text-muted-foreground">Copier ou redistribuer notre contenu sans autorisation</span>
                </div>
                <div className="flex items-start gap-2 p-3 bg-red-500/5 rounded-lg border border-red-500/10">
                  <Ban className="w-4 h-4 text-red-500 mt-0.5" />
                  <span className="text-sm text-muted-foreground">Utiliser des robots, scrapers ou moyens automatisés</span>
                </div>
                <div className="flex items-start gap-2 p-3 bg-red-500/5 rounded-lg border border-red-500/10">
                  <Ban className="w-4 h-4 text-red-500 mt-0.5" />
                  <span className="text-sm text-muted-foreground">Transmettre des virus ou codes malveillants</span>
                </div>
                <div className="flex items-start gap-2 p-3 bg-red-500/5 rounded-lg border border-red-500/10">
                  <Ban className="w-4 h-4 text-red-500 mt-0.5" />
                  <span className="text-sm text-muted-foreground">Usurper l'identité d'une autre personne</span>
                </div>
                <div className="flex items-start gap-2 p-3 bg-red-500/5 rounded-lg border border-red-500/10">
                  <Ban className="w-4 h-4 text-red-500 mt-0.5" />
                  <span className="text-sm text-muted-foreground">Publier du contenu diffamatoire ou illégal</span>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="section-5" className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Droits de Propriété Intellectuelle</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Tout le contenu présent sur CasaBourse.ma, y compris mais sans s'y limiter, les textes,
                graphiques, logos, images, données financières, algorithmes, logiciels et la conception
                du site, est la propriété de CasaBourse.ma ou de ses fournisseurs de contenu.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Ce contenu est protégé par :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Les lois marocaines sur la propriété intellectuelle</li>
                <li>Les conventions internationales sur le droit d'auteur</li>
                <li>Les lois sur les marques et brevets</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Licence limitée :</strong> Vous bénéficiez d'une licence limitée, non exclusive
                et révocable pour accéder et utiliser le contenu du site pour votre usage personnel
                et non commercial uniquement.
              </p>
            </section>

            {/* Section 6 */}
            <section id="section-6" className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Exactitude des Informations</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Bien que nous nous efforcions de fournir des informations exactes et à jour,
                nous ne garantissons pas :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>L'exactitude, l'exhaustivité ou l'actualité de toutes les informations</li>
                <li>L'absence d'erreurs dans les données financières</li>
                <li>La disponibilité continue et sans interruption du service</li>
                <li>Que les résultats obtenus seront exacts ou fiables</li>
              </ul>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                      Délais des données
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      Les données de marché peuvent être retardées de 15 à 20 minutes par rapport
                      au temps réel. Pour des données en temps réel, veuillez consulter les sources
                      officielles de la Bourse de Casablanca.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section id="section-7" className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Limitation de Responsabilité</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Dans toute la mesure permise par la loi applicable :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>CasaBourse.ma ne sera pas responsable des dommages directs, indirects,
                    accessoires, spéciaux ou consécutifs résultant de l'utilisation ou de
                    l'impossibilité d'utiliser le site</li>
                <li>Nous ne sommes pas responsables des décisions d'investissement prises sur
                    la base des informations fournies sur notre site</li>
                <li>Le site est fourni "tel quel" et "selon disponibilité" sans garantie d'aucune sorte</li>
                <li>Nous déclinons toute responsabilité pour les pertes financières résultant de
                    l'utilisation de nos services</li>
              </ul>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-sm text-red-700 dark:text-red-300">
                  <strong>Avertissement sur les risques :</strong> L'investissement en bourse comporte
                  des risques de perte en capital. Les performances passées ne préjugent pas des
                  performances futures. Consultez un conseiller financier agréé avant de prendre
                  des décisions d'investissement.
                </p>
              </div>
            </section>

            {/* Section 8 - Indemnification */}
            <section id="section-8" className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Gavel className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Indemnisation</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Vous acceptez d'indemniser, de défendre et de dégager de toute responsabilité
                CasaBourse.ma, ses dirigeants, employés, partenaires et fournisseurs contre toute
                réclamation, dommage, obligation, perte, responsabilité, coût ou dette, et dépense
                (y compris les honoraires d'avocat) découlant de :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Votre utilisation et accès au Site</li>
                <li>Votre violation de ces Conditions d'Utilisation</li>
                <li>Votre violation des droits d'un tiers, y compris les droits de propriété intellectuelle</li>
                <li>Tout contenu que vous publiez ou partagez via le Site</li>
              </ul>
            </section>

            {/* Section 9 - Subscriptions */}
            <section id="section-9" className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Abonnements et Paiements</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                CasaBourse.ma propose des services gratuits et des abonnements premium.
                Pour les abonnements payants :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li><strong>Facturation :</strong> Les abonnements sont facturés mensuellement
                    ou annuellement selon votre choix</li>
                <li><strong>Renouvellement automatique :</strong> Les abonnements se renouvellent
                    automatiquement sauf annulation préalable</li>
                <li><strong>Prix :</strong> Les prix sont affichés en Dirhams Marocains (MAD) et
                    peuvent être modifiés avec préavis de 30 jours</li>
                <li><strong>Remboursements :</strong> Les frais d'abonnement ne sont généralement
                    pas remboursables, sauf disposition légale contraire</li>
              </ul>
              <div className="flex items-center gap-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <Award className="w-8 h-8 text-green-500" />
                <div>
                  <p className="font-medium text-foreground">Garantie de satisfaction</p>
                  <p className="text-sm text-muted-foreground">
                    Essai gratuit de 14 jours pour tous les nouveaux abonnés premium
                  </p>
                </div>
              </div>
            </section>

            {/* Section 10 - Termination */}
            <section id="section-10" className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">10</span>
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Résiliation</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>Résiliation par l'utilisateur :</strong>
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Vous pouvez supprimer votre compte à tout moment depuis les paramètres</li>
                <li>L'annulation d'un abonnement prend effet à la fin de la période de facturation en cours</li>
                <li>Vos données seront conservées pendant 30 jours après la suppression</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>Résiliation par CasaBourse.ma :</strong>
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Nous pouvons suspendre ou résilier votre compte en cas de violation des conditions</li>
                <li>Nous pouvons fermer votre compte après 12 mois d'inactivité</li>
                <li>En cas de résiliation pour violation, aucun remboursement ne sera effectué</li>
              </ul>
            </section>

            {/* Section 11 */}
            <section id="section-11" className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Liens Externes</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Notre site peut contenir des liens vers des sites web tiers. Ces liens sont
                fournis pour votre commodité. Nous n'avons aucun contrôle sur ces sites et
                ne sommes pas responsables de :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Leur contenu ou leur exactitude</li>
                <li>Leurs politiques de confidentialité ou pratiques</li>
                <li>Leur disponibilité ou leur fonctionnement</li>
                <li>Tout dommage résultant de leur utilisation</li>
              </ul>
            </section>

            {/* Section 12 - Data Protection */}
            <section id="section-12" className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Protection des Données</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                La protection de vos données personnelles est une priorité pour CasaBourse.ma.
                Nous nous engageons à :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Collecter uniquement les données nécessaires au fonctionnement du service</li>
                <li>Protéger vos données avec des mesures de sécurité appropriées</li>
                <li>Ne jamais vendre vos données personnelles à des tiers</li>
                <li>Vous permettre d'accéder, modifier ou supprimer vos données</li>
                <li>Respecter la loi marocaine 09-08 relative à la protection des personnes
                    physiques à l'égard du traitement des données à caractère personnel</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Pour plus de détails, veuillez consulter notre{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Politique de Confidentialité
                </Link>.
              </p>
            </section>

            {/* Section 13 */}
            <section id="section-13" className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Modifications</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>Modifications du Service :</strong> Nous nous réservons le droit de modifier,
                suspendre ou interrompre tout ou partie du service à tout moment, avec ou sans préavis.
                Nous ne serons pas responsables envers vous ou tout tiers pour toute modification,
                suspension ou interruption du service.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>Modifications des Conditions :</strong> Nous pouvons réviser ces Conditions
                d'Utilisation à tout moment. La version la plus récente sera toujours disponible sur
                cette page avec la date de dernière mise à jour.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Pour les modifications importantes, nous vous informerons par email ou par notification
                sur le site. Votre utilisation continue du site après de telles modifications constitue
                votre acceptation des nouvelles conditions.
              </p>
            </section>

            {/* Section 14 - Dispute Resolution */}
            <section id="section-14" className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Scale className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Règlement des Litiges</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>Loi Applicable :</strong> Ces Conditions d'Utilisation sont régies par les
                lois du Royaume du Maroc.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>Résolution à l'amiable :</strong> En cas de litige, les parties s'engagent
                à rechercher une solution amiable avant toute action en justice. Vous pouvez nous
                contacter à l'adresse indiquée ci-dessous.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>Médiation :</strong> Si aucune solution amiable n'est trouvée dans un délai
                de 30 jours, les parties peuvent recourir à la médiation conformément au règlement
                de médiation du Centre de Médiation et d'Arbitrage de la Chambre de Commerce de
                Casablanca.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Juridiction compétente :</strong> Tout litige non résolu sera soumis à la
                compétence exclusive des tribunaux de Casablanca, Maroc.
              </p>
            </section>

            {/* Section 15 - General Provisions */}
            <section id="section-15" className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Dispositions Générales</h2>
              </div>
              <ul className="list-disc list-inside text-muted-foreground space-y-3">
                <li>
                  <strong>Intégralité de l'accord :</strong> Ces conditions constituent l'intégralité
                  de l'accord entre vous et CasaBourse.ma et remplacent tout accord antérieur.
                </li>
                <li>
                  <strong>Divisibilité :</strong> Si une disposition de ces conditions est jugée
                  invalide, les autres dispositions restent en vigueur.
                </li>
                <li>
                  <strong>Non-renonciation :</strong> Le fait de ne pas exercer un droit ne
                  constitue pas une renonciation à ce droit.
                </li>
                <li>
                  <strong>Cession :</strong> Vous ne pouvez pas céder vos droits ou obligations
                  sans notre accord écrit préalable.
                </li>
                <li>
                  <strong>Force majeure :</strong> Nous ne serons pas responsables des retards
                  ou défaillances dus à des événements indépendants de notre volonté.
                </li>
              </ul>
            </section>

            {/* Section 16 - Contact */}
            <section id="section-16" className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Contact</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Pour toute question concernant ces Conditions d'Utilisation, veuillez nous contacter :
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="font-medium text-foreground mb-2">Email</p>
                  <a
                    href="mailto:contact@casabourse.ma"
                    className="text-primary hover:underline"
                  >
                    contact@casabourse.ma
                  </a>
                </div>
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="font-medium text-foreground mb-2">Support</p>
                  <a
                    href="mailto:support@casabourse.ma"
                    className="text-primary hover:underline"
                  >
                    support@casabourse.ma
                  </a>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <p className="text-foreground">
                  <strong>Adresse postale :</strong>
                </p>
                <p className="text-muted-foreground">
                  CasaBourse.ma<br />
                  Casablanca Finance City<br />
                  Boulevard El Massira El Khadra<br />
                  Casablanca 20250, Maroc
                </p>
              </div>
              <Separator className="my-4" />
              <p className="text-sm text-muted-foreground">
                Nous nous engageons à répondre à toutes les demandes dans un délai de 48 heures ouvrables.
              </p>
            </section>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
