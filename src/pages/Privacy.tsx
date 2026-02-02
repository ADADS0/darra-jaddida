import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Eye, Database, Lock, Users, Clock, Mail, Settings } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/landing/Footer";

const Privacy = () => {
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
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Politique de Confidentialité</h1>
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
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <span className="text-green-500 font-bold">1</span>
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Introduction</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                CasaBourse.ma ("nous", "notre" ou "nos") s'engage à protéger la confidentialité de vos informations
                personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons,
                divulguons et protégeons vos informations lorsque vous utilisez notre site web.
              </p>
            </section>

            {/* Section 2 */}
            <section className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Database className="w-4 h-4 text-green-500" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Informations que nous collectons</h2>
              </div>

              <h3 className="text-lg font-medium text-foreground mt-6 mb-3">2.1 Informations que vous nous fournissez</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Nom et prénom</li>
                <li>Adresse e-mail</li>
                <li>Informations de compte (si vous vous inscrivez)</li>
                <li>Communications que vous nous envoyez</li>
              </ul>

              <h3 className="text-lg font-medium text-foreground mb-3">2.2 Informations collectées automatiquement</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Adresse IP</li>
                <li>Type de navigateur et version</li>
                <li>Pages visitées et temps passé sur le site</li>
                <li>Données de cookies et technologies similaires</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-green-500" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Comment nous utilisons vos informations</h2>
              </div>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Fournir et améliorer nos services</li>
                <li>Personnaliser votre expérience utilisateur</li>
                <li>Communiquer avec vous concernant nos services</li>
                <li>Analyser l'utilisation du site et améliorer nos contenus</li>
                <li>Respecter nos obligations légales</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-green-500" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Partage de vos informations</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Nous ne vendons ni ne louons vos informations personnelles à des tiers. Nous pouvons partager
                vos informations avec :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Prestataires de services qui nous aident à exploiter notre site web</li>
                <li>Autorités légales si requis par la loi</li>
                <li>Partenaires commerciaux avec votre consentement explicite</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-green-500" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Cookies et technologies de suivi</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience sur
                notre site. Pour plus d'informations, consultez notre Politique des Cookies.
              </p>
            </section>

            {/* Section 6 */}
            <section className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-green-500" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Sécurité de vos données</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Nous mettons en oeuvre des mesures de sécurité techniques et organisationnelles appropriées pour
                protéger vos informations personnelles contre tout accès, modification, divulgation ou destruction
                non autorisés.
              </p>
            </section>

            {/* Section 7 */}
            <section className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-green-500" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Vos droits</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Conformément à la loi marocaine et au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Droit d'accès à vos données personnelles</li>
                <li>Droit de rectification des données inexactes</li>
                <li>Droit à l'effacement ("droit à l'oubli")</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit à la portabilité des données</li>
                <li>Droit d'opposition au traitement</li>
              </ul>
              <p className="text-muted-foreground">
                Pour exercer ces droits, veuillez nous contacter à :{" "}
                <a href="mailto:contact@casabourse.ma" className="text-primary hover:underline">
                  contact@casabourse.ma
                </a>
              </p>
            </section>

            {/* Section 8 */}
            <section className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-green-500" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Conservation des données</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Nous conservons vos informations personnelles aussi longtemps que nécessaire pour fournir nos
                services et respecter nos obligations légales.
              </p>
            </section>

            {/* Section 9 */}
            <section className="mb-10 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <span className="text-green-500 font-bold">9</span>
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Modifications de cette politique</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Nous pouvons mettre à jour cette politique de confidentialité périodiquement. Les modifications
                seront publiées sur cette page avec une date de mise à jour révisée.
              </p>
            </section>

            {/* Section 10 - Contact */}
            <section className="p-6 bg-gradient-to-br from-green-500/5 to-green-500/10 rounded-xl border border-green-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-green-500" />
                </div>
                <h2 className="text-xl font-semibold text-foreground m-0">Nous contacter</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Pour toute question concernant cette politique de confidentialité, veuillez nous contacter à :
              </p>
              <div className="space-y-2">
                <p className="text-foreground">
                  <strong>Email :</strong>{" "}
                  <a href="mailto:contact@casabourse.ma" className="text-green-500 hover:underline">
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

export default Privacy;
