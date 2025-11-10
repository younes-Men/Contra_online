import React from "react";
import { useState, useRef } from "react";
import SignaturePad from "./SignaturePad";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Import des images fixes (assurez-vous que ces chemins sont corrects)
import image1 from "../images/image1.png";
import image2 from "../images/image2.png";

function RentalContract() {
  const [formData, setFormData] = useState({
    reservationNumber: "",
    // Locataire - Français
    locataire: "",
    adressePersonnelle: "",
    telPersonnel: "",
    cinPasseport: "",
    permisConduit: "",
    delivreLe: "",
    // Locataire - Arabe (champs séparés)
    locataireAr: "",
    adressePersonnelleAr: "",
    telPersonnelAr: "",
    cinPasseportAr: "",
    permisConduitAr: "",
    delivreLeAr: "",
    // Autre conducteur - Français
    autreConducteurAdresse: "",
    autreConducteurCin: "",
    autreConducteurPermis: "",
    autreConducteurDelivreLe: "",
    // Autre conducteur - Arabe (champs séparés)
    autreConducteurAdresseAr: "",
    autreConducteurCinAr: "",
    autreConducteurPermisAr: "",
    autreConducteurDelivreLeAr: "",
    // Période de location
    dateDe: "",
    dateA: "",
    heure: "",
    km: "",
    marqueVoiture: "",
    marqueVoitureAr: "",
    // SUPPRIMÉ: les champs image1 et image2 car nous utilisons des images fixes
  });

  const [signature, setSignature] = useState(null);
  const contractRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignatureSave = (dataURL) => {
    setSignature(dataURL);
  };

  const handleSignatureClear = () => {
    setSignature(null);
  };

  const generatePDF = async () => {
    if (!contractRef.current) return;

    try {
      // Afficher le contrat pour la capture PDF
      contractRef.current.style.display = "block";

      const canvas = await html2canvas(contractRef.current, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: contractRef.current.scrollWidth,
        height: contractRef.current.scrollHeight,
        allowTaint: true,
      });

      // Cacher le contrat après la capture
      contractRef.current.style.display = "none";

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const imgWidthMM = imgWidth * 0.264583;
      const imgHeightMM = imgHeight * 0.264583;

      const ratio = Math.min(pdfWidth / imgWidthMM, pdfHeight / imgHeightMM);
      const imgScaledWidth = imgWidthMM * ratio;
      const imgScaledHeight = imgHeightMM * ratio;

      const xOffset = (pdfWidth - imgScaledWidth) / 2;
      const yOffset = 0;

      pdf.addImage(
        imgData,
        "PNG",
        xOffset,
        yOffset,
        imgScaledWidth,
        imgScaledHeight
      );

      const fileName = `contrat-location-${formData.reservationNumber}.pdf`;
      pdf.save(fileName);

      setTimeout(() => {
        const phoneNumber = "0644553500";
        const message = encodeURIComponent(
          `Nouveau contrat de location\n` +
            `Réservation #${formData.reservationNumber}\n` +
            `Locataire: ${formData.locataire}\n` +
            `Marque de voiture: ${formData.marqueVoiture}\n` +
            `Période: ${formData.dateDe} au ${formData.dateA}\n\n` +
            `Veuillez joindre le PDF téléchargé.`
        );
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(whatsappUrl, "_blank");
      }, 500);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      alert("Erreur lors de la génération du PDF");
      if (contractRef.current) {
        contractRef.current.style.display = "none";
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-2 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Contrat visible avec formulaire intégré */}
        <div
          className="bg-white shadow-lg mb-6"
          style={{
            padding: "20mm 15mm",
            fontFamily: "Arial, sans-serif",
            fontSize: "11px",
            lineHeight: "1.4",
          }}
        >
          {/* Header */}
          <div className="mb-6">
            {/* Numéro Réservation */}
            <div
              className="mb-4"
              style={{ display: "flex", justifyContent: "flex-start" }}
            >
              <div
                style={{
                  display: "flex",
                  border: "1px solid black",
                  width: "fit-content",
                }}
              >
                <div
                  style={{
                    borderRight: "1px solid black",
                    padding: "4px 8px",
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                >
                  Numéro Réservation
                </div>
                <div
                  style={{
                    padding: "4px 8px",
                    minWidth: "30px",
                    fontSize: "10px",
                    textAlign: "center",
                  }}
                >
                  <input
                    type="text"
                    name="reservationNumber"
                    value={formData.reservationNumber}
                    onChange={handleInputChange}
                    readOnly
                    style={{
                      border: "none",
                      outline: "none",
                      width: "100%",
                      textAlign: "center",
                      fontSize: "10px",
                      background: "transparent",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Titre */}
            <div className="text-center mb-4">
              <h1
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                  letterSpacing: "1px",
                }}
              >
                CONTRAT DE LOCATION
              </h1>
            </div>

            {/* NOUVELLE STRUCTURE RESPONSIVE POUR L'ALIGNEMENT DES INFOS ET DES IMAGES */}
            {/* Les images sont maintenant côte à côte (display: flex) sur mobile, et l'info compagnie est toujours au-dessus */}
            <div
              className="flex flex-col gap-4" // Le conteneur principal est en colonne (mobile et desktop)
              style={{
                marginTop: "10px",
              }}
            >
              {/* 1. Company Info - TOUJOURS EN HAUT ET CENTRÉ */}
              <div
                className="mb-4"
                style={{
                  textAlign: "center",
                  flexGrow: 1,
                  maxWidth: "400px",
                  margin: "0 auto", // Centre le bloc
                  width: "100%",
                }}
              >
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    textDecoration: "underline",
                    marginBottom: "6px",
                    textAlign: "center",
                  }}
                >
                  MED CAR LUXE
                </h2>
                <p
                  style={{
                    fontSize: "12px",
                    marginBottom: "8px",
                    textAlign: "center",
                  }}
                >
                  Location De Voiture
                </p>
                <div
                  style={{
                    fontSize: "11px",
                    textAlign: "center",
                    lineHeight: "1.8",
                    marginTop: "4px",
                  }}
                >
                  <p style={{ marginBottom: "3px" }}>
                    Numéro/Whatsapp: **0649491043** ; **0631913770**
                  </p>
                  <p style={{ marginBottom: "3px" }}>
                    Whatsapp: **+44 7960 412207**
                  </p>
                  <p>
                    Adresse: **Livraison dans tous les aéroports du Maroc**
                  </p>
                </div>
              </div>

              {/* 2. Conteneur des Images - CÔTE À CÔTE MÊME SUR MOBILE */}
              <div
                className="flex items-center justify-between gap-4" // Utilise flex par défaut (row)
                style={{
                  width: "100%",
                }}
              >
                {/* Image 1 - Gauche */}
                <div
                  style={{
                    width: "120px",
                    height: "80px",
                    border: "2px solid #e5e5e5",
                    backgroundColor: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "9px",
                    color: "#999",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={image1}
                    alt="Voiture 1"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                {/* Ajout d'un div pour pousser les images aux extrémités (seulement si flex n'est pas utilisé) */}
                <div style={{ flexGrow: 1 }}></div>

                {/* Image 2 - Droite */}
                <div
                  style={{
                    width: "120px",
                    height: "80px",
                    border: "2px solid #e5e5e5",
                    backgroundColor: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "9px",
                    color: "#999",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={image2}
                    alt="Voiture 2"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            </div>
            {/* FIN de la NOUVELLE STRUCTURE */}
          </div>

          {/* Main Content - Two Columns */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "30px",
              marginBottom: "20px",
            }}
          >
            {/* Left column - French */}
            <div>
              <h3
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  marginBottom: "12px",
                  fontSize: "11px",
                }}
              >
                Contrat de location
              </h3>

              <div style={{ marginBottom: "16px" }}>
                
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    fontSize: "10px",
                  }}
                >
                  <div>
                    <div style={{ marginBottom: "2px" }}>Locataire</div>
                    <input
                      type="text"
                      name="locataire"
                      value={formData.locataire}
                      onChange={handleInputChange}
                      style={{
                        border: "none",
                        borderBottom: "1px solid black",
                        width: "100%",
                        padding: "2px 0",
                        fontSize: "10px",
                        background: "transparent",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <div style={{ marginBottom: "2px" }}>
                      Adresse personnelle
                    </div>
                    <input
                      type="text"
                      name="adressePersonnelle"
                      value={formData.adressePersonnelle}
                      onChange={handleInputChange}
                      style={{
                        border: "none",
                        borderBottom: "1px solid black",
                        width: "100%",
                        padding: "2px 0",
                        fontSize: "10px",
                        background: "transparent",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <div style={{ marginBottom: "2px" }}>Tél personnel</div>
                    <input
                      type="text"
                      name="telPersonnel"
                      value={formData.telPersonnel}
                      onChange={handleInputChange}
                      style={{
                        border: "none",
                        borderBottom: "1px solid black",
                        width: "100%",
                        padding: "2px 0",
                        fontSize: "10px",
                        background: "transparent",
                        outline: "none",
                      }}
                      inputMode="tel"
                    />
                  </div>
                  <div>
                    <div style={{ marginBottom: "2px" }}>
                      C.I.N ou passeport N
                    </div>
                    <input
                      type="text"
                      name="cinPasseport"
                      value={formData.cinPasseport}
                      onChange={handleInputChange}
                      style={{
                        border: "none",
                        borderBottom: "1px solid black",
                        width: "100%",
                        padding: "2px 0",
                        fontSize: "10px",
                        background: "transparent",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <div style={{ marginBottom: "2px" }}>
                      Permis de conduit N
                    </div>
                    <input
                      type="text"
                      name="permisConduit"
                      value={formData.permisConduit}
                      onChange={handleInputChange}
                      style={{
                        border: "none",
                        borderBottom: "1px solid black",
                        width: "100%",
                        padding: "2px 0",
                        fontSize: "10px",
                        background: "transparent",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <div style={{ marginBottom: "2px" }}>Délivré le</div>
                    <input
                      type="date"
                      name="delivreLe"
                      value={formData.delivreLe}
                      onChange={handleInputChange}
                      style={{
                        border: "none",
                        borderBottom: "1px solid black",
                        width: "100%",
                        padding: "2px 0",
                        fontSize: "10px",
                        background: "transparent",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: "16px" }}>
                  <h4
                    style={{
                      fontWeight: "bold",
                      marginBottom: "8px",
                      fontSize: "11px",
                    }}
                  >
                    Autre conducteur
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      fontSize: "10px",
                    }}
                  >
                    <div>
                      <div style={{ marginBottom: "2px" }}>
                        Adresse personnelle
                      </div>
                      <input
                        type="text"
                        name="autreConducteurAdresse"
                        value={formData.autreConducteurAdresse}
                        onChange={handleInputChange}
                        style={{
                          border: "none",
                          borderBottom: "1px solid black",
                          width: "100%",
                          padding: "2px 0",
                          fontSize: "10px",
                          background: "transparent",
                          outline: "none",
                        }}
                      />
                    </div>
                    <div>
                      <div style={{ marginBottom: "2px" }}>
                        C.I.N ou passeport N
                      </div>
                      <input
                        type="text"
                        name="autreConducteurCin"
                        value={formData.autreConducteurCin}
                        onChange={handleInputChange}
                        style={{
                          border: "none",
                          borderBottom: "1px solid black",
                          width: "100%",
                          padding: "2px 0",
                          fontSize: "10px",
                          background: "transparent",
                          outline: "none",
                        }}
                      />
                    </div>
                    <div>
                      <div style={{ marginBottom: "2px" }}>
                        Permis de conduit de l'autre conducteur N
                      </div>
                      <input
                        type="text"
                        name="autreConducteurPermis"
                        value={formData.autreConducteurPermis}
                        onChange={handleInputChange}
                        style={{
                          border: "none",
                          borderBottom: "1px solid black",
                          width: "100%",
                          padding: "2px 0",
                          fontSize: "10px",
                          background: "transparent",
                          outline: "none",
                        }}
                      />
                    </div>
                    <div>
                      <div style={{ marginBottom: "2px" }}>Délivré le</div>
                      <input
                        type="date"
                        name="autreConducteurDelivreLe"
                        value={formData.autreConducteurDelivreLe}
                        onChange={handleInputChange}
                        style={{
                          border: "none",
                          borderBottom: "1px solid black",
                          width: "100%",
                          padding: "2px 0",
                          fontSize: "10px",
                          background: "transparent",
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "16px" }}>
                  <div>
                    <div style={{ marginBottom: "2px" }}>Marque de voiture</div>
                    <input
                      type="text"
                      name="marqueVoiture"
                      value={formData.marqueVoiture}
                      onChange={handleInputChange}
                      style={{
                        border: "none",
                        borderBottom: "1px solid black",
                        width: "100%",
                        padding: "2px 0",
                        fontSize: "10px",
                        background: "transparent",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Right column - Arabic */}
            <div dir="rtl" style={{ textAlign: "right" }}>
              <h3
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  marginBottom: "12px",
                  fontSize: "11px",
                }}
              >
                عقد الكراء
              </h3>

              <div style={{ marginBottom: "16px" }}>
                
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    fontSize: "10px",
                  }}
                >
                  <div>
                    <div style={{ marginBottom: "2px" }}>المكتري</div>
                    <input
                      type="text"
                      name="locataireAr"
                      value={formData.locataireAr}
                      onChange={handleInputChange}
                      style={{
                        border: "none",
                        borderBottom: "1px solid black",
                        width: "100%",
                        padding: "2px 0",
                        fontSize: "10px",
                        background: "transparent",
                        outline: "none",
                      }}
                      dir="rtl"
                      lang="ar"
                    />
                  </div>
                  <div>
                    <div style={{ marginBottom: "2px" }}>العنوان الشخصي</div>
                    <input
                      type="text"
                      name="adressePersonnelleAr"
                      value={formData.adressePersonnelleAr}
                      onChange={handleInputChange}
                      style={{
                        border: "none",
                        borderBottom: "1px solid black",
                        width: "100%",
                        padding: "2px 0",
                        fontSize: "10px",
                        background: "transparent",
                        outline: "none",
                      }}
                      dir="rtl"
                      lang="ar"
                    />
                  </div>
                  <div>
                    <div style={{ marginBottom: "2px" }}>الهاتف الشخصي</div>
                    <input
                      type="text"
                      name="telPersonnelAr"
                      value={formData.telPersonnelAr}
                      onChange={handleInputChange}
                      style={{
                        border: "none",
                        borderBottom: "1px solid black",
                        width: "100%",
                        padding: "2px 0",
                        fontSize: "10px",
                        background: "transparent",
                        outline: "none",
                      }}
                      dir="rtl"
                      inputMode="tel"
                    />
                  </div>
                  <div>
                    <div style={{ marginBottom: "2px" }}>
                      رقم بطاقة الوطنية أو جواز السفر
                    </div>
                    <input
                      type="text"
                      name="cinPasseportAr"
                      value={formData.cinPasseportAr}
                      onChange={handleInputChange}
                      style={{
                        border: "none",
                        borderBottom: "1px solid black",
                        width: "100%",
                        padding: "2px 0",
                        fontSize: "10px",
                        background: "transparent",
                        outline: "none",
                      }}
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <div style={{ marginBottom: "2px" }}>رخصة السياقة رقم</div>
                    <input
                      type="text"
                      name="permisConduitAr"
                      value={formData.permisConduitAr}
                      onChange={handleInputChange}
                      style={{
                        border: "none",
                        borderBottom: "1px solid black",
                        width: "100%",
                        padding: "2px 0",
                        fontSize: "10px",
                        background: "transparent",
                        outline: "none",
                      }}
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <div style={{ marginBottom: "2px" }}>مسلمة في</div>
                    <input
                      type="date"
                      name="delivreLeAr"
                      value={formData.delivreLeAr}
                      onChange={handleInputChange}
                      style={{
                        border: "none",
                        borderBottom: "1px solid black",
                        width: "100%",
                        padding: "2px 0",
                        fontSize: "10px",
                        background: "transparent",
                        outline: "none",
                      }}
                      dir="rtl"
                    />
                  </div>
                </div>

                <div style={{ marginTop: "16px" }}>
                  <h4
                    style={{
                      fontWeight: "bold",
                      marginBottom: "8px",
                      fontSize: "11px",
                    }}
                  >
                    سائق أخر
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      fontSize: "10px",
                    }}
                  >
                    <div>
                      <div style={{ marginBottom: "2px" }}>العنوان الشخصي</div>
                      <input
                        type="text"
                        name="autreConducteurAdresseAr"
                        value={formData.autreConducteurAdresseAr}
                        onChange={handleInputChange}
                        style={{
                          border: "none",
                          borderBottom: "1px solid black",
                          width: "100%",
                          padding: "2px 0",
                          fontSize: "10px",
                          background: "transparent",
                          outline: "none",
                        }}
                        dir="rtl"
                        lang="ar"
                      />
                    </div>
                    <div>
                      <div style={{ marginBottom: "2px" }}>
                        بطاقة التعريف الوطنية أو جواز السفر رقم
                      </div>
                      <input
                        type="text"
                        name="autreConducteurCinAr"
                        value={formData.autreConducteurCinAr}
                        onChange={handleInputChange}
                        style={{
                          border: "none",
                          borderBottom: "1px solid black",
                          width: "100%",
                          padding: "2px 0",
                          fontSize: "10px",
                          background: "transparent",
                          outline: "none",
                        }}
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <div style={{ marginBottom: "2px" }}>
                        رخصة السياقة للشخص الأخر رقم
                      </div>
                      <input
                        type="text"
                        name="autreConducteurPermisAr"
                        value={formData.autreConducteurPermisAr}
                        onChange={handleInputChange}
                        style={{
                          border: "none",
                          borderBottom: "1px solid black",
                          width: "100%",
                          padding: "2px 0",
                          fontSize: "10px",
                          background: "transparent",
                          outline: "none",
                        }}
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <div style={{ marginBottom: "2px" }}>مسلمة في</div>
                      <input
                        type="date"
                        name="autreConducteurDelivreLeAr"
                        value={formData.autreConducteurDelivreLeAr}
                        onChange={handleInputChange}
                        style={{
                          border: "none",
                          borderBottom: "1px solid black",
                          width: "100%",
                          padding: "2px 0",
                          fontSize: "10px",
                          background: "transparent",
                          outline: "none",
                        }}
                        dir="rtl"
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "16px" }}>
                  <div>
                    <div style={{ marginBottom: "2px" }}>Marque de voiture</div>
                    {/* ATTENTION: L'input ci-dessous utilise "marqueVoiture" (français) au lieu de "marqueVoitureAr" */}
                    <input
                      type="text"
                      name="marqueVoiture"
                      value={formData.marqueVoiture}
                      onChange={handleInputChange}
                      style={{
                        border: "none",
                        borderBottom: "1px solid black",
                        width: "100%",
                        padding: "2px 0",
                        fontSize: "10px",
                        background: "transparent",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* **FIN** du Main Content - Two Columns */}
          </div>

          {/* Footer - CORRECTION RESPONSIVE dans le formulaire visible */}
          <div
            // CLASSE TAILWIND CORRIGÉE: flex-col-reverse sur mobile, flex-row sur desktop
            className="flex flex-col-reverse gap-5 md:flex-row md:justify-between md:items-end md:gap-[30px] mt-8"
            style={{
              marginTop: "30px",
            }}
          >
            {/* Signature */}
            <div
              style={{
                textAlign: "center",
                width: "100%",
                maxWidth: "400px",
              }}
              className="md:max-w-[45%] mx-auto md:mx-0"
            >
              <p
                style={{
                  fontWeight: "bold",
                  marginBottom: "8px",
                  fontSize: "11px",
                }}
              >
                توقيع الزبون
              </p>
              <SignaturePad
                onSave={handleSignatureSave}
                onClear={handleSignatureClear}
              />
              {signature && (
                <img
                  src={signature || "/placeholder.svg"}
                  alt="Signature"
                  style={{
                    maxWidth: "180px",
                    maxHeight: "70px",
                    marginBottom: "8px",
                    display: "block",
                    margin: "8px auto",
                  }}
                />
              )}
            </div>

            {/* Period box */}
            <div
              style={{
                border: "3px solid black",
                borderRadius: "15px",
                padding: "12px",
                width: "100%",
                backgroundColor: "white",
                maxWidth: "400px",
              }}
              className="md:w-[45%] mx-auto md:mx-0"
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  fontSize: "10px",
                }}
              >
                {/* French */}
                <div>
                  <div style={{ marginBottom: "8px" }}>
                    <div style={{ marginBottom: "2px", fontWeight: "bold" }}>
                      De
                    </div>
                    <input
                      type="date"
                      name="dateDe"
                      value={formData.dateDe}
                      onChange={handleInputChange}
                      style={{
                        border: "none",
                        borderBottom: "1px solid #ccc",
                        width: "100%",
                        padding: "2px 0",
                        fontSize: "10px",
                        background: "transparent",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    <div style={{ marginBottom: "2px", fontWeight: "bold" }}>
                      A
                    </div>
                    <input
                      type="date"
                      name="dateA"
                      value={formData.dateA}
                      onChange={handleInputChange}
                      style={{
                        border: "none",
                        borderBottom: "1px solid #ccc",
                        width: "100%",
                        padding: "2px 0",
                        fontSize: "10px",
                        background: "transparent",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    <div style={{ marginBottom: "2px", fontWeight: "bold" }}>
                      Heure
                    </div>
                    <input
                      type="time"
                      name="heure"
                      value={formData.heure}
                      onChange={handleInputChange}
                      style={{
                        border: "none",
                        borderBottom: "1px solid #ccc",
                        width: "100%",
                        padding: "2px 0",
                        fontSize: "10px",
                        background: "transparent",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <div style={{ marginBottom: "2px", fontWeight: "bold" }}>
                      Km
                    </div>
                    <input
                      type="text"
                      name="km"
                      value={formData.km}
                      onChange={handleInputChange}
                      style={{
                        border: "none",
                        borderBottom: "1px solid #ccc",
                        width: "100%",
                        padding: "2px 0",
                        fontSize: "10px",
                        background: "transparent",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
                {/* Arabic */}
                <div dir="rtl" style={{ textAlign: "right" }}>
                  <div style={{ marginBottom: "8px" }}>
                    <div style={{ marginBottom: "2px", fontWeight: "bold" }}>
                      من
                    </div>
                    <input
                      type="date"
                      name="dateDe"
                      value={formData.dateDe}
                      onChange={handleInputChange}
                      style={{
                        border: "none",
                        borderBottom: "1px solid #ccc",
                        width: "100%",
                        padding: "2px 0",
                        fontSize: "10px",
                        background: "transparent",
                        outline: "none",
                      }}
                      dir="rtl"
                    />
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    <div style={{ marginBottom: "2px", fontWeight: "bold" }}>
                      إلى
                    </div>
                    <input
                      type="date"
                      name="dateA"
                      value={formData.dateA}
                      onChange={handleInputChange}
                      style={{
                        border: "none",
                        borderBottom: "1px solid #ccc",
                        width: "100%",
                        padding: "2px 0",
                        fontSize: "10px",
                        background: "transparent",
                        outline: "none",
                      }}
                      dir="rtl"
                    />
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    <div style={{ marginBottom: "2px", fontWeight: "bold" }}>
                      الساعة
                    </div>
                    <input
                      type="time"
                      name="heure"
                      value={formData.heure}
                      onChange={handleInputChange}
                      style={{
                        border: "none",
                        borderBottom: "1px solid #ccc",
                        width: "100%",
                        padding: "2px 0",
                        fontSize: "10px",
                        background: "transparent",
                        outline: "none",
                      }}
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <div style={{ marginBottom: "2px", fontWeight: "bold" }}>
                      الكيلومتراج
                    </div>
                    <input
                      type="text"
                      name="km"
                      value={formData.km}
                      onChange={handleInputChange}
                      style={{
                        border: "none",
                        borderBottom: "1px solid #ccc",
                        width: "100%",
                        padding: "2px 0",
                        fontSize: "10px",
                        background: "transparent",
                        outline: "none",
                      }}
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div> {/* FIN du Footer du Contrat visible */}

          {/* Download button */}
          <div className="mt-8 text-center">
            <button
              onClick={generatePDF}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors"
            >
              Télécharger le Contrat en PDF
            </button>
          </div>
        </div> {/* FIN du Contrat visible avec formulaire intégré */}

        {/* PDF Preview */}
        <div
          ref={contractRef}
          className="bg-white"
          style={{
            display: "none",
            width: "210mm",
            minHeight: "297mm",
            padding: "20mm 15mm",
            fontFamily: "Arial, sans-serif",
            fontSize: "11px",
            lineHeight: "1.4",
          }}
        >
          <div className="w-full" style={{ pageBreakAfter: "avoid" }}>
            <div className="mb-6">
              <div
                className="mb-4"
                style={{ display: "flex", justifyContent: "flex-start" }}
              >
                <div
                  style={{
                    display: "flex",
                    border: "1px solid black",
                    width: "fit-content",
                  }}
                >
                  <div
                    style={{
                      borderRight: "1px solid black",
                      padding: "4px 8px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    Numéro Réservation
                  </div>
                  <div
                    style={{
                      padding: "4px 8px",
                      minWidth: "30px",
                      fontSize: "12px",
                      textAlign: "center",
                    }}
                  >
                    {formData.reservationNumber || ""}
                  </div>
                </div>
              </div>

              <div className="text-center mb-4">
                <h1
                  style={{
                    fontSize: "22px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    marginBottom: "12px",
                    letterSpacing: "1px",
                  }}
                >
                  CONTRAT DE LOCATION
                </h1>
              </div>

              <div className="mb-4" style={{ textAlign: "left" }}>
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    textDecoration: "underline",
                    marginBottom: "6px",
                    textAlign: "center",
                  }}
                >
                  MED CAR LUXE
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    marginBottom: "8px",
                    textAlign: "center",
                  }}
                >
                  Location De Voiture
                </p>
                <div
                  style={{
                    fontSize: "13px",
                    textAlign: "left",
                    lineHeight: "1.8",
                    marginTop: "4px",
                  }}
                >
                  <p style={{ marginBottom: "3px" }}>
                    Numéro/Whatsapp: 0649491043 ; 0631913770
                  </p>
                  <p style={{ marginBottom: "3px" }}>
                    Whatsapp: +44 7960 412207
                  </p>
                  <p>Adresse: Livraison dans tous les aéroports du Maroc</p>
                </div>
              </div>

              {/* Car Images in PDF Preview - REMPLACÉ PAR LES IMAGES FIXES */}
              <div
                className="flex justify-center gap-8 mb-6"
                style={{ marginTop: "10px" }}
              >
                <div
                  style={{
                    width: "120px",
                    height: "80px",
                    border: "2px solid #e5e5e5",
                    backgroundColor: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "9px",
                    color: "#999",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={image1}
                    alt="Voiture 1"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div
                  style={{
                    width: "120px",
                    height: "80px",
                    border: "2px solid #e5e5e5",
                    backgroundColor: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "9px",
                    color: "#999",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={image2}
                    alt="Voiture 2"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "30px",
                marginBottom: "20px",
              }}
            >
              {/* Left column - French */}
              <div>
                <h3
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    marginBottom: "12px",
                    fontSize: "13px",
                  }}
                >
                  Contrat de location
                </h3>

                <div style={{ marginBottom: "16px" }}>
                  <h4
                    style={{
                      fontWeight: "bold",
                      marginBottom: "8px",
                      fontSize: "13px",
                    }}
                  >
                    Locataire
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      fontSize: "12px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          marginBottom: "2px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        Locataire
                      </div>
                      <div
                        style={{
                          borderBottom: "1px solid black",
                          minHeight: "25px", // CORRECTION
                          paddingTop: "0", // CORRECTION
                          paddingBottom: "3px", // Ajouté
                          fontSize: "12px",
                          wordWrap: "break-word",
                          wordBreak: "break-word",
                        }}
                      >
                        {formData.locataire || ""}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          marginBottom: "2px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        Adresse personnelle
                      </div>
                      <div
                        style={{
                          borderBottom: "1px solid black",
                          minHeight: "25px", // CORRECTION
                          paddingTop: "0", // CORRECTION
                          paddingBottom: "3px", // Ajouté
                          fontSize: "12px",
                          wordWrap: "break-word",
                          wordBreak: "break-word",
                        }}
                      >
                        {formData.adressePersonnelle || ""}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          marginBottom: "2px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        Tél personnel
                      </div>
                      <div
                        style={{
                          borderBottom: "1px solid black",
                          minHeight: "25px", // CORRECTION
                          paddingTop: "0", // CORRECTION
                          paddingBottom: "3px", // Ajouté
                          fontSize: "12px",
                        }}
                      >
                        {formData.telPersonnel || ""}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          marginBottom: "2px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        C.I.N ou passeport N
                      </div>
                      <div
                        style={{
                          borderBottom: "1px solid black",
                          minHeight: "25px", // CORRECTION
                          paddingTop: "0", // CORRECTION
                          paddingBottom: "3px", // Ajouté
                          fontSize: "12px",
                        }}
                      >
                        {formData.cinPasseport || ""}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          marginBottom: "2px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        Permis de conduit N
                      </div>
                      <div
                        style={{
                          borderBottom: "1px solid black",
                          minHeight: "25px", // CORRECTION
                          paddingTop: "0", // CORRECTION
                          paddingBottom: "3px", // Ajouté
                          fontSize: "12px",
                        }}
                      >
                        {formData.permisConduit || ""}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          marginBottom: "2px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        Délivré le
                      </div>
                      <div
                        style={{
                          borderBottom: "1px solid black",
                          minHeight: "25px", // CORRECTION
                          paddingTop: "0", // CORRECTION
                          paddingBottom: "3px", // Ajouté
                          fontSize: "12px",
                        }}
                      >
                        {formData.delivreLe || ""}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: "16px" }}>
                    <h4
                      style={{
                        fontWeight: "bold",
                        marginBottom: "8px",
                        fontSize: "13px",
                      }}
                    >
                      Autre conducteur
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        fontSize: "12px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            marginBottom: "2px",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          Adresse personnelle
                        </div>
                        <div
                          style={{
                            borderBottom: "1px solid black",
                            minHeight: "25px", // CORRECTION
                            paddingTop: "0", // CORRECTION
                            paddingBottom: "3px", // Ajouté
                            fontSize: "12px",
                            wordWrap: "break-word",
                            wordBreak: "break-word",
                          }}
                        >
                          {formData.autreConducteurAdresse || ""}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            marginBottom: "2px",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          C.I.N ou passeport N
                        </div>
                        <div
                          style={{
                            borderBottom: "1px solid black",
                            minHeight: "25px", // CORRECTION
                            paddingTop: "0", // CORRECTION
                            paddingBottom: "3px", // Ajouté
                            fontSize: "12px",
                          }}
                        >
                          {formData.autreConducteurCin || ""}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            marginBottom: "2px",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          Permis de conduit de l'autre conducteur N
                        </div>
                        <div
                          style={{
                            borderBottom: "1px solid black",
                            minHeight: "25px", // CORRECTION
                            paddingTop: "0", // CORRECTION
                            paddingBottom: "3px", // Ajouté
                            fontSize: "12px",
                          }}
                        >
                          {formData.autreConducteurPermis || ""}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            marginBottom: "2px",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          Délivré le
                        </div>
                        <div
                          style={{
                            borderBottom: "1px solid black",
                            minHeight: "25px", // CORRECTION
                            paddingTop: "0", // CORRECTION
                            paddingBottom: "3px", // Ajouté
                            fontSize: "12px",
                          }}
                        >
                          {formData.autreConducteurDelivreLe || ""}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "16px" }}>
                  <div>
                    <div
                      style={{
                        marginBottom: "2px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      Marque de voiture
                    </div>
                    <div
                      style={{
                        borderBottom: "1px solid black",
                        minHeight: "25px", // CORRECTION
                        paddingTop: "0", // CORRECTION
                        paddingBottom: "3px", // Ajouté
                        fontSize: "12px",
                      }}
                    >
                      {formData.marqueVoiture || ""}
                    </div>
                  </div>
                </div>
              </div>

              <div dir="rtl" style={{ textAlign: "right" }}>
                <h3
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    marginBottom: "12px",
                    fontSize: "13px",
                  }}
                >
                  عقد الكراء
                </h3>

                <div style={{ marginBottom: "16px" }}>
                  <h4
                    style={{
                      fontWeight: "bold",
                      marginBottom: "8px",
                      fontSize: "13px",
                    }}
                  >
                    المكتري
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      fontSize: "12px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          marginBottom: "2px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        المكتري
                      </div>
                      <div
                        style={{
                          borderBottom: "1px solid black",
                          minHeight: "25px", // CORRECTION
                          paddingTop: "0", // CORRECTION
                          paddingBottom: "3px", // Ajouté
                          fontSize: "12px",
                          wordWrap: "break-word",
                          wordBreak: "break-word",
                        }}
                      >
                        {formData.locataireAr || ""}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          marginBottom: "2px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        العنوان الشخصي
                      </div>
                      <div
                        style={{
                          borderBottom: "1px solid black",
                          minHeight: "25px", // CORRECTION
                          paddingTop: "0", // CORRECTION
                          paddingBottom: "3px", // Ajouté
                          fontSize: "12px",
                          wordWrap: "break-word",
                          wordBreak: "break-word",
                        }}
                      >
                        {formData.adressePersonnelleAr || ""}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          marginBottom: "2px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        الهاتف الشخصي
                      </div>
                      <div
                        style={{
                          borderBottom: "1px solid black",
                          minHeight: "25px", // CORRECTION
                          paddingTop: "0", // CORRECTION
                          paddingBottom: "3px", // Ajouté
                          fontSize: "12px",
                        }}
                      >
                        {formData.telPersonnelAr || ""}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          marginBottom: "2px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        بطاقة التعريف الوطنية أو جواز السفر رقم
                      </div>
                      <div
                        style={{
                          borderBottom: "1px solid black",
                          minHeight: "25px", // CORRECTION
                          paddingTop: "0", // CORRECTION
                          paddingBottom: "3px", // Ajouté
                          fontSize: "12px",
                        }}
                      >
                        {formData.cinPasseportAr || ""}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          marginBottom: "2px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        رخصة السياقة رقم
                      </div>
                      <div
                        style={{
                          borderBottom: "1px solid black",
                          minHeight: "25px", // CORRECTION
                          paddingTop: "0", // CORRECTION
                          paddingBottom: "3px", // Ajouté
                          fontSize: "12px",
                        }}
                      >
                        {formData.permisConduitAr || ""}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          marginBottom: "2px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        مسلمة في
                      </div>
                      <div
                        style={{
                          borderBottom: "1px solid black",
                          minHeight: "25px", // CORRECTION
                          paddingTop: "0", // CORRECTION
                          paddingBottom: "3px", // Ajouté
                          fontSize: "12px",
                        }}
                      >
                        {formData.delivreLeAr || ""}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: "16px" }}>
                    <h4
                      style={{
                        fontWeight: "bold",
                        marginBottom: "8px",
                        fontSize: "13px",
                      }}
                    >
                      سائق أخر
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        fontSize: "12px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            marginBottom: "2px",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          العنوان الشخصي
                        </div>
                        <div
                          style={{
                            borderBottom: "1px solid black",
                            minHeight: "25px", // CORRECTION
                            paddingTop: "0", // CORRECTION
                            paddingBottom: "3px", // Ajouté
                            fontSize: "12px",
                            wordWrap: "break-word",
                            wordBreak: "break-word",
                          }}
                        >
                          {formData.autreConducteurAdresseAr || ""}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            marginBottom: "2px",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          بطاقة التعريف الوطنية أو جواز السفر رقم
                        </div>
                        <div
                          style={{
                            borderBottom: "1px solid black",
                            minHeight: "25px", // CORRECTION
                            paddingTop: "0", // CORRECTION
                            paddingBottom: "3px", // Ajouté
                            fontSize: "12px",
                          }}
                        >
                          {formData.autreConducteurCinAr || ""}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            marginBottom: "2px",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          رخصة السياقة للشخص الأخر رقم
                        </div>
                        <div
                          style={{
                            borderBottom: "1px solid black",
                            minHeight: "25px", // CORRECTION
                            paddingTop: "0", // CORRECTION
                            paddingBottom: "3px", // Ajouté
                            fontSize: "12px",
                          }}
                        >
                          {formData.autreConducteurPermisAr || ""}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            marginBottom: "2px",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          مسلمة في
                        </div>
                        <div
                          style={{
                            borderBottom: "1px solid black",
                            minHeight: "25px", // CORRECTION
                            paddingTop: "0", // CORRECTION
                            paddingBottom: "3px", // Ajouté
                            fontSize: "12px",
                          }}
                        >
                          {formData.autreConducteurDelivreLeAr || ""}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "16px" }}>
                  <div>
                    <div
                      style={{
                        marginBottom: "2px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      Marque de voiture
                    </div>
                    <div
                      style={{
                        borderBottom: "1px solid black",
                        minHeight: "25px", // CORRECTION
                        paddingTop: "0", // CORRECTION
                        paddingBottom: "3px", // Ajouté
                        fontSize: "12px",
                      }}
                    >
                      {formData.marqueVoitureAr || ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - CORRECTION RESPONSIVE dans le PDF Preview (DOIT ETRE EN FLEX POUR LE PDF) */}
            <div
              // Force display: flex et largeurs pour la mise en page A4 (desktop-like)
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginTop: "30px",
              }}
            >
              {/* Signature */}
              <div
                style={{
                  textAlign: "center",
                  flex: "1",
                  maxWidth: "40%", // Largeur fixe pour le PDF
                }}
              >
                <p
                  style={{
                    fontWeight: "bold",
                    marginBottom: "8px",
                    fontSize: "13px",
                  }}
                >
                  توقيع الزبون
                </p>
                {signature && (
                  <img
                    src={signature || "/placeholder.svg"}
                    alt="Signature"
                    style={{
                      maxWidth: "180px",
                      maxHeight: "70px",
                      marginBottom: "8px",
                      display: "block",
                      margin: "0 auto 8px",
                    }}
                  />
                )}
                <div
                  style={{
                    borderBottom: "1px solid black",
                    width: "200px",
                    height: "60px",
                    margin: "0 auto",
                  }}
                ></div>
              </div>

              {/* Period box */}
              <div
                style={{
                  border: "3px solid black",
                  borderRadius: "15px",
                  padding: "12px",
                  width: "45%", // Largeur fixe pour le PDF
                  backgroundColor: "white",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    fontSize: "12px",
                  }}
                >
                  {/* French Dates */}
                  <div>
                    <div style={{ marginBottom: "8px" }}>
                      <div
                        style={{
                          marginBottom: "2px",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        De
                      </div>
                      <div
                        style={{
                          borderBottom: "1px solid #ccc",
                          minHeight: "25px", // CORRECTION
                          paddingTop: "0", // CORRECTION
                          paddingBottom: "3px", // Ajouté
                          fontSize: "12px",
                        }}
                      >
                        {formData.dateDe}
                      </div>
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <div
                        style={{
                          marginBottom: "2px",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        A
                      </div>
                      <div
                        style={{
                          borderBottom: "1px solid #ccc",
                          minHeight: "25px", // CORRECTION
                          paddingTop: "0", // CORRECTION
                          paddingBottom: "3px", // Ajouté
                          fontSize: "12px",
                        }}
                      >
                        {formData.dateA}
                      </div>
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <div
                        style={{
                          marginBottom: "2px",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        Heure
                      </div>
                      <div
                        style={{
                          borderBottom: "1px solid #ccc",
                          minHeight: "25px", // CORRECTION
                          paddingTop: "0", // CORRECTION
                          paddingBottom: "3px", // Ajouté
                          fontSize: "12px",
                        }}
                      >
                        {formData.heure}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          marginBottom: "2px",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        Km
                      </div>
                      <div
                        style={{
                          borderBottom: "1px solid #ccc",
                          minHeight: "25px", // CORRECTION
                          paddingTop: "0", // CORRECTION
                          paddingBottom: "3px", // Ajouté
                          fontSize: "12px",
                        }}
                      >
                        {formData.km}
                      </div>
                    </div>
                  </div>
                  {/* Arabic Dates */}
                  <div dir="rtl" style={{ textAlign: "right" }}>
                    <div style={{ marginBottom: "8px" }}>
                      <div
                        style={{
                          marginBottom: "2px",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        من
                      </div>
                      <div
                        style={{
                          borderBottom: "1px solid #ccc",
                          minHeight: "25px", // CORRECTION
                          paddingTop: "0", // CORRECTION
                          paddingBottom: "3px", // Ajouté
                          fontSize: "12px",
                        }}
                      >
                        {formData.dateDe}
                      </div>
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <div
                        style={{
                          marginBottom: "2px",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        إلى
                      </div>
                      <div
                        style={{
                          borderBottom: "1px solid #ccc",
                          minHeight: "25px", // CORRECTION
                          paddingTop: "0", // CORRECTION
                          paddingBottom: "3px", // Ajouté
                          fontSize: "12px",
                        }}
                      >
                        {formData.dateA}
                      </div>
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <div
                        style={{
                          marginBottom: "2px",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        الساعة
                      </div>
                      <div
                        style={{
                          borderBottom: "1px solid #ccc",
                          minHeight: "25px", // CORRECTION
                          paddingTop: "0", // CORRECTION
                          paddingBottom: "3px", // Ajouté
                          fontSize: "12px",
                        }}
                      >
                        {formData.heure}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          marginBottom: "2px",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        الكيلومتراج
                      </div>
                      <div
                        style={{
                          borderBottom: "1px solid #ccc",
                          minHeight: "25px", // CORRECTION
                          paddingTop: "0", // CORRECTION
                          paddingBottom: "3px", // Ajouté
                          fontSize: "12px",
                        }}
                      >
                        {formData.km}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> {/* FIN du Footer du PDF */}
          </div> {/* FIN du w-full du PDF */}
        </div> {/* FIN du PDF Preview */}
      </div> {/* FIN du max-w-6xl mx-auto */}
    </div> /* FIN du min-h-screen */
  );
}

export default RentalContract;