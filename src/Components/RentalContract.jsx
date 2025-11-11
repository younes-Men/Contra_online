import React from "react";
import { useState, useRef } from "react";
import SignaturePad from "./SignaturePad";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Import du logo uniquement (les autres images sont supprimées)
import Logo from "../images/Logo.png"


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
    autreConducteurNom: "", // <-- Champ ajouté
    autreConducteurAdresse: "",
    autreConducteurCin: "",
    autreConducteurPermis: "",
    autreConducteurDelivreLe: "",
    // Autre conducteur - Arabe (champs séparés)
    autreConductreurNomAr: "" , // <-- Champ ajouté
    autreConducteurAdresseAr: "",
    autreConducteurCinAr: "",
    autreConducteurPermisAr: "",
    autreConducteurDelivreLeAr: "",
    // Période de location
    dateDe: "",
    dateA: "",
    heure: "",
    km: "",
    // Nouveaux champs pour la section Voiture
    marque: "",
    matricule: "",
    carburant: "",
    marqueAr: "",
    matriculeAr: "",
    carburantAr: "",
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
        {/* Contrat visible avec formulaire intégré (Taille non modifiée ici car c'est l'interface utilisateur) */}
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
            {/* Numéro Réservation (Version visible) */}
            <div
              className="mb-4"
              style={{ display: "flex", justifyContent: "flex-start" }}
            >
              <div
                style={{
                  display: "flex",
                  border: "1px solid black",
                  width: "fit-content",
                  alignItems: "center", // Centrage vertical pour l'input
                }}
              >
                <div
                  style={{
                    borderRight: "1px solid black",
                    padding: "4px 8px", // RÉTROGRADATION TAILLE: Rendu plus petit
                    fontSize: "10px", // RÉTROGRADATION TAILLE: Rendu plus petit
                    fontWeight: "bold",
                    whiteSpace: "nowrap", // EMPÊCHE LE RETOUR À LA LIGNE
                  }}
                >
                  Numéro Réservation
                </div>
                <div
                  style={{
                    padding: "4px 8px", // RÉTROGRADATION TAILLE: Rendu plus petit
                    minWidth: "40px", // RÉTROGRADATION TAILLE: Rendu plus petit
                    fontSize: "10px", // RÉTROGRADATION TAILLE: Rendu plus petit
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
                      padding: "0", // Garder le padding de l'input à 0 pour le centrage
                    }}
                  />
                </div>
              </div>
            </div>

            {/* DEBUT MODIFICATION LOGO - VISIBLE COMPONENT (AGRANDI ET CENTRÉ) */}
            <div className="flex justify-center mb-4">
              <img
                src={Logo}
                alt="logo"
                style={{
                  maxWidth: "200px", // Agrandir le logo
                  height: "auto",
                  display: "block",
                }}
                className="h-auto w-32" // Cette classe Tailwind peut être ignorée si maxWidth est défini directement
              />
            </div>
            {/* FIN MODIFICATION LOGO - VISIBLE COMPONENT */}


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

            {/* Company Info - TOUJOURS EN HAUT ET CENTRÉ (Les images latérales ont été supprimées) */}
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
                  fontSize: "13px",
                  textAlign: "center",
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
                <p>
                  Adresse: Livraison dans tous les aéroports du Maroc
                </p>
              </div>
            </div>
            {/* FIN de Company Info */}
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
                    <div style={{ marginBottom: "2px" }}>Nom de Locataire</div>
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
                      C.I.N ou Num passeport
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
                      Num Permis de conduit
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
                      type="text" // MODIFIÉ
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
                    {/* CORRECTION: nom de l'input pour le nom */}
                    <div>
                      <div style={{ marginBottom: "2px" }}>Nom </div>
                      <input
                        type="text"
                        name="autreConducteurNom" // CORRIGÉ
                        value={formData.autreConducteurNom}
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
                        C.I.N ou Num passeport
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
                        Num Permis de conduit
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
                        type="text" // MODIFIÉ
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

                {/* NOUVELLE SECTION VOITURE - Français */}
                <div style={{ marginTop: "16px" }}>
                  <h4
                    style={{
                      fontWeight: "bold",
                      marginBottom: "8px",
                      fontSize: "11px",
                    }}
                  >
                    Voiture
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      fontSize: "10px",
                    }}
                  >
                    {/* Marque */}
                    <div>
                      <div style={{ marginBottom: "2px" }}>Marque</div>
                      <input
                        type="text"
                        name="marque"
                        value={formData.marque}
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
                    {/* Matricule */}
                    <div>
                      <div style={{ marginBottom: "2px" }}>Matricule</div>
                      <input
                        type="text"
                        name="matricule"
                        value={formData.matricule}
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
                    {/* Carburant */}
                    <div>
                      <div style={{ marginBottom: "2px" }}>Carburant</div>
                      <input
                        type="text"
                        name="carburant"
                        value={formData.carburant}
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
                {/* FIN de NOUVELLE SECTION VOITURE - Français */}

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
                    <div style={{ marginBottom: "2px" }}>اسم المكتري</div>
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
                    <div style={{ marginBottom: "2px" }}> رقم رخصة السياقة </div>
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
                      type="text" // MODIFIÉ
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
                    {/* NOUVEAU/CORRIGÉ: Nom de l'autre conducteur (Arabe) */}
                    <div>
                      <div style={{ marginBottom: "2px" }}> اسم السائق الآخر</div>
                      <input
                        type="text"
                        name="autreConductreurNomAr" // CORRIGÉ
                        value={formData.autreConductreurNomAr} // CORRIGÉ
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
                    {/* ADRESSE: (Adresse Personnelle de l'autre conducteur) */}
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
                    {/* FIN de la correction */}
                    <div>
                      <div style={{ marginBottom: "2px" }}>
                        رقم بطاقة الوطنية أو جواز السفر
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
                        رقم رخصة السياقة
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
                        type="text" // MODIFIÉ
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

                {/* NOUVELLE SECTION VOITURE - Arabe */}
                <div style={{ marginTop: "16px" }}>
                  <h4
                    style={{
                      fontWeight: "bold",
                      marginBottom: "8px",
                      fontSize: "11px",
                    }}
                  >
                    السيارة
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      fontSize: "10px",
                    }}
                  >
                    {/* Marque (العلامة) */}
                    <div>
                      <div style={{ marginBottom: "2px" }}>النوع</div>
                      <input
                        type="text"
                        name="marqueAr"
                        value={formData.marqueAr}
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
                    {/* Matricule (الترقيم) */}
                    <div>
                      <div style={{ marginBottom: "2px" }}>الترقيم</div>
                      <input
                        type="text"
                        name="matriculeAr"
                        value={formData.matriculeAr}
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
                    {/* Carburant (نوع الوقود) */}
                    <div>
                      <div style={{ marginBottom: "2px" }}>نوع الوقود</div>
                      <input
                        type="text"
                        name="carburantAr"
                        value={formData.carburantAr}
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
                  </div>
                </div>
                {/* FIN de NOUVELLE SECTION VOITURE - Arabe */}
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
                      type="text" // MODIFIÉ
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
                      type="text" // MODIFIÉ
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
                      type="text" // MODIFIÉ
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
                      type="text" // MODIFIÉ
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
            // AUGMENTATION DE LA TAILLE DE BASE (était 11px)
            fontSize: "16x",
            lineHeight: "1.4",
          }}
        >
          <div className="w-full" style={{ pageBreakAfter: "avoid" }}>
            <div className="mb-6">
              {/* *** MODIFICATION : Numéro Réservation (Version PDF - Styles uniformisés) *** */}
              <div
              className="mb-4"
              style={{ display: "flex", justifyContent: "flex-start" }}
            >
              <div
                style={{
                  display: "flex",
                  border: "1px solid black",
                  width: "fit-content",
                  alignItems: "center", // Centrage vertical pour l'input
                }}
              >
                <div
                  style={{
                    borderRight: "1px solid black",
                    padding: "0 2px 5px 2px", // RÉTROGRADATION TAILLE: Rendu plus petit
                    fontSize: "13px", // RÉTROGRADATION TAILLE: Rendu plus petit
                    fontWeight: "bold",
                    whiteSpace: "nowrap", // EMPÊCHE LE RETOUR À LA LIGNE
                  }}
                >
                  Numéro Réservation
                </div>
                <div
                  style={{
                    padding: "4px 8px", // RÉTROGRADATION TAILLE: Rendu plus petit
                    minWidth: "40px", // RÉTROGRADATION TAILLE: Rendu plus petit
                    fontSize: "10px", // RÉTROGRADATION TAILLE: Rendu plus petit
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
                      padding: "0", // Garder le padding de l'input à 0 pour le centrage
                    }}
                  />
                </div>
              </div>
            </div>
              {/* Fin de Numéro Réservation (Version PDF) */}

              {/* DEBUT MODIFICATION LOGO - PDF COMPONENT (AJOUTÉ, AGRANDI ET CENTRÉ) */}
              <div className="text-center mb-4" style={{ margin: "15px 0" }}>
                <img
                  src={Logo}
                  alt="logo"
                  style={{
                    maxWidth: "200px", // Agrandir le logo pour le PDF
                    height: "auto",
                    display: "block",
                    margin: "0 auto" // Centrage
                  }}
                />
              </div>
              {/* FIN MODIFICATION LOGO - PDF COMPONENT */}


              {/* Titre */}
              <div className="text-center mb-4">
                <h1
                  style={{
                    // TAILLE AJUSTÉE (était 18px)
                    fontSize: "20px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    marginBottom: "12px",
                    letterSpacing: "1px",
                  }}
                >
                  CONTRAT DE LOCATION
                </h1>
              </div>

              {/* Company Info - (Les images latérales ont été supprimées du PDF également) */}
              <div
                className="mb-4"
                style={{
                  textAlign: "center",
                  flexGrow: 1,
                  maxWidth: "500px",
                  margin: "0 auto", // Centre le bloc
                  width: "auto",
                }}
              >
                <h2
                  style={{
                    // TAILLE AJUSTÉE (était 20px)
                    fontSize: "28px",
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
                    // TAILLE AJUSTÉE (était 12px)
                    fontSize: "16px",
                    marginBottom: "8px",
                    textAlign: "center",
                  }}
                >
                  Location De Voiture
                </p>
                <div
                  style={{
                    // TAILLE AJUSTÉE (était 13px)
                    fontSize: "15px",
                    textAlign: "center", // ALIGNEMENT AU CENTRE POUR LE PDF
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
              {/* FIN de Company Info pour le PDF */}
            </div>

            {/* Main Content - Two Columns (PDF) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "30px",
                marginBottom: "20px",
              }}
            >
              {/* Left column - French (PDF) */}
              <div>
                <h3
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    marginBottom: "12px",
                    // TAILLE AJUSTÉE (était 13px)
                    fontSize: "15px",
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
                      // TAILLE AJUSTÉE (était 12px)
                      fontSize: "14px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          marginBottom: "2px",
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        Nom de Locataire
                      </div>
                      <div
                        style={{
                          borderBottom: "1px solid black",
                          minHeight: "25px", // CORRECTION
                          paddingTop: "0", // CORRECTION
                          paddingBottom: "3px", // Ajouté
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
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
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
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
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
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
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
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
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
                        }}
                      >
                        {formData.telPersonnel || ""}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          marginBottom: "2px",
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
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
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
                        }}
                      >
                        {formData.cinPasseport || ""}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          marginBottom: "2px",
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
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
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
                        }}
                      >
                        {formData.permisConduit || ""}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          marginBottom: "2px",
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
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
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
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
                        // TAILLE AJUSTÉE (était 13px)
                        fontSize: "15px",
                      }}
                    >
                      Autre conducteur
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        // TAILLE AJUSTÉE (était 12px)
                        fontSize: "14px",
                      }}
                    >
                      {/* NOUVEAU: Nom de l'autre conducteur (Français) */}
                      <div>
                        <div
                          style={{
                            marginBottom: "2px",
                            // TAILLE AJUSTÉE (était 12px)
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                        >
                          Nom
                        </div>
                        <div
                          style={{
                            borderBottom: "1px solid black",
                            minHeight: "25px", // CORRECTION
                            paddingTop: "0", // CORRECTION
                            paddingBottom: "3px", // Ajouté
                            // TAILLE AJUSTÉE (était 12px)
                            fontSize: "14px",
                            wordWrap: "break-word",
                            wordBreak: "break-word",
                          }}
                        >
                          {formData.autreConducteurNom || ""}
                        </div>
                      </div>
                      {/* FIN NOUVEAU */}
                      <div>
                        <div
                          style={{
                            marginBottom: "2px",
                            // TAILLE AJUSTÉE (était 12px)
                            fontSize: "14px",
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
                            // TAILLE AJUSTÉE (était 12px)
                            fontSize: "14px",
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
                            // TAILLE AJUSTÉE (était 12px)
                            fontSize: "14px",
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
                            // TAILLE AJUSTÉE (était 12px)
                            fontSize: "14px",
                          }}
                        >
                          {formData.autreConducteurCin || ""}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            marginBottom: "2px",
                            // TAILLE AJUSTÉE (était 12px)
                            fontSize: "14px",
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
                            // TAILLE AJUSTÉE (était 12px)
                            fontSize: "14px",
                          }}
                        >
                          {formData.autreConducteurPermis || ""}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            marginBottom: "2px",
                            // TAILLE AJUSTÉE (était 12px)
                            fontSize: "14px",
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
                            // TAILLE AJUSTÉE (était 12px)
                            fontSize: "14px",
                          }}
                        >
                          {formData.autreConducteurDelivreLe || ""}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* NOUVELLE SECTION VOITURE - Français (PDF) */}
                  <div style={{ marginTop: "16px" }}>
                    <h4
                      style={{
                        fontWeight: "bold",
                        marginBottom: "8px",
                        // TAILLE AJUSTÉE (était 13px)
                        fontSize: "15px",
                      }}
                    >
                      Voiture
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        // TAILLE AJUSTÉE (était 12px)
                        fontSize: "14px",
                      }}
                    >
                      {/* Marque */}
                      <div>
                        <div
                          style={{
                            marginBottom: "2px",
                            // TAILLE AJUSTÉE (était 12px)
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                        >
                          Marque
                        </div>
                        <div
                          style={{
                            borderBottom: "1px solid black",
                            minHeight: "25px", // CORRECTION
                            paddingTop: "0", // CORRECTION
                            paddingBottom: "3px", // Ajouté
                            // TAILLE AJUSTÉE (était 12px)
                            fontSize: "14px",
                          }}
                        >
                          {formData.marque || ""}
                        </div>
                      </div>
                      {/* Matricule */}
                      <div>
                        <div
                          style={{
                            marginBottom: "2px",
                            // TAILLE AJUSTÉE (était 12px)
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                        >
                          Matricule
                        </div>
                        <div
                          style={{
                            borderBottom: "1px solid black",
                            minHeight: "25px", // CORRECTION
                            paddingTop: "0", // CORRECTION
                            paddingBottom: "3px", // Ajouté
                            // TAILLE AJUSTÉE (était 12px)
                            fontSize: "14px",
                          }}
                        >
                          {formData.matricule || ""}
                        </div>
                      </div>
                      {/* Carburant */}
                      <div>
                        <div
                          style={{
                            marginBottom: "2px",
                            // TAILLE AJUSTÉE (était 12px)
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                        >
                          Carburant
                        </div>
                        <div
                          style={{
                            borderBottom: "1px solid black",
                            minHeight: "25px", // CORRECTION
                            paddingTop: "0", // CORRECTION
                            paddingBottom: "3px", // Ajouté
                            // TAILLE AJUSTÉE (était 12px)
                            fontSize: "14px",
                          }}
                        >
                          {formData.carburant || ""}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* FIN de NOUVELLE SECTION VOITURE - Français (PDF) */}
                </div>
              </div>
              {/* Right column - Arabic (PDF) */}
              <div dir="rtl" style={{ textAlign: "right" }}>
                <h3
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    marginBottom: "12px",
                    // TAILLE AJUSTÉE (était 13px)
                    fontSize: "15px",
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
                      // TAILLE AJUSTÉE (était 12px)
                      fontSize: "14px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          marginBottom: "2px",
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
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
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
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
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
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
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
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
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
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
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
                        }}
                      >
                        {formData.telPersonnelAr || ""}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          marginBottom: "2px",
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        رقم بطاقة الوطنية أو جواز السفر
                      </div>
                      <div
                        style={{
                          borderBottom: "1px solid black",
                          minHeight: "25px", // CORRECTION
                          paddingTop: "0", // CORRECTION
                          paddingBottom: "3px", // Ajouté
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
                        }}
                      >
                        {formData.cinPasseportAr || ""}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          marginBottom: "2px",
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        رقم رخصة السياقة
                      </div>
                      <div
                        style={{
                          borderBottom: "1px solid black",
                          minHeight: "25px", // CORRECTION
                          paddingTop: "0", // CORRECTION
                          paddingBottom: "3px", // Ajouté
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
                        }}
                      >
                        {formData.permisConduitAr || ""}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          marginBottom: "2px",
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
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
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
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
                        // TAILLE AJUSTÉE (était 13px)
                        fontSize: "15px",
                      }}
                    >
                      سائق أخر
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        // TAILLE AJUSTÉE (était 12px)
                        fontSize: "14px",
                      }}
                    >
                      {/* NOUVEAU: Nom de l'autre conducteur (Arabe) */}
                      <div>
                        <div
                          style={{
                            marginBottom: "2px",
                            // TAILLE AJUSTÉE (était 12px)
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                        >
                          اسم السائق الآخر
                        </div>
                        <div
                          style={{
                            borderBottom: "1px solid black",
                            minHeight: "25px", // CORRECTION
                            paddingTop: "0", // CORRECTION
                            paddingBottom: "3px", // Ajouté
                            // TAILLE AJUSTÉE (était 12px)
                            fontSize: "14px",
                            wordWrap: "break-word",
                            wordBreak: "break-word",
                          }}
                        >
                          {formData.autreConductreurNomAr || ""}
                        </div>
                      </div>
                      {/* FIN NOUVEAU */}
                      <div>
                        <div
                          style={{
                            marginBottom: "2px",
                            // TAILLE AJUSTÉE (était 12px)
                            fontSize: "14px",
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
                            // TAILLE AJUSTÉE (était 12px)
                            fontSize: "14px",
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
                            // TAILLE AJUSTÉE (était 12px)
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                        >
                          رقم بطاقة الوطنية أو جواز السفر
                        </div>
                        <div
                          style={{
                            borderBottom: "1px solid black",
                            minHeight: "25px", // CORRECTION
                            paddingTop: "0", // CORRECTION
                            paddingBottom: "3px", // Ajouté
                            // TAILLE AJUSTÉE (était 12px)
                            fontSize: "14px",
                          }}
                        >
                          {formData.autreConducteurCinAr || ""}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            marginBottom: "2px",
                            // TAILLE AJUSTÉE (était 12px)
                            fontSize: "14px",
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
                            // TAILLE AJUSTÉE (était 12px)
                            fontSize: "14px",
                          }}
                        >
                          {formData.autreConducteurPermisAr || ""}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            marginBottom: "2px",
                            // TAILLE AJUSTÉE (était 12px)
                            fontSize: "14px",
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
                            // TAILLE AJUSTÉE (était 12px)
                            fontSize: "14px",
                          }}
                        >
                          {formData.autreConducteurDelivreLeAr || ""}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* NOUVELLE SECTION VOITURE - Arabe (PDF) */}
                <div style={{ marginTop: "16px" }}>
                  <h4
                    style={{
                      fontWeight: "bold",
                      marginBottom: "8px",
                      // TAILLE AJUSTÉE (était 13px)
                      fontSize: "15px",
                    }}
                  >
                    السيارة
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      // TAILLE AJUSTÉE (était 12px)
                      fontSize: "14px",
                    }}
                  >
                    {/* Marque (العلامة) */}
                    <div>
                      <div
                        style={{
                          marginBottom: "2px",
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        النوع
                      </div>
                      <div
                        style={{
                          borderBottom: "1px solid black",
                          minHeight: "25px", // CORRECTION
                          paddingTop: "0", // CORRECTION
                          paddingBottom: "3px", // Ajouté
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
                        }}
                      >
                        {formData.marqueAr || ""}
                      </div>
                    </div>
                    {/* Matricule (الترقيم) */}
                    <div>
                      <div
                        style={{
                          marginBottom: "2px",
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        الترقيم
                      </div>
                      <div
                        style={{
                          borderBottom: "1px solid black",
                          minHeight: "25px", // CORRECTION
                          paddingTop: "0", // CORRECTION
                          paddingBottom: "3px", // Ajouté
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
                        }}
                      >
                        {formData.matriculeAr || ""}
                      </div>
                    </div>
                    {/* Carburant (نوع الوقود) */}
                    <div>
                      <div
                        style={{
                          marginBottom: "2px",
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        نوع الوقود
                      </div>
                      <div
                        style={{
                          borderBottom: "1px solid black",
                          minHeight: "25px", // CORRECTION
                          paddingTop: "0", // CORRECTION
                          paddingBottom: "3px", // Ajouté
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
                        }}
                      >
                        {formData.carburantAr || ""}
                      </div>
                    </div>
                  </div>
                </div>
                {/* FIN de NOUVELLE SECTION VOITURE - Arabe (PDF) */}
              </div>
            </div>
            {/* **FIN** du Main Content - Two Columns (PDF) */}

            {/* Footer (PDF) */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                gap: "30px",
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
                    // TAILLE AJUSTÉE (était 13px)
                    fontSize: "15px",
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
                    // TAILLE AJUSTÉE (était 12px)
                    fontSize: "14px",
                  }}
                >
                  {/* French Dates */}
                  <div>
                    <div style={{ marginBottom: "8px" }}>
                      <div
                        style={{
                          marginBottom: "2px",
                          fontWeight: "bold",
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
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
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
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
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
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
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
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
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
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
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
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
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
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
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
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
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
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
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
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
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
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
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
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
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
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
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
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
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
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
                          // TAILLE AJUSTÉE (était 12px)
                          fontSize: "14px",
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
      </div>
      </div>


  );
}

export default RentalContract;