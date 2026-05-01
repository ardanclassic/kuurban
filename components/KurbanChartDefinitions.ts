/**
 * Mermaid chart definitions for the Kurban workflow diagram.
 * Two orientations are provided:
 *   - kurbanChartLR  : horizontal, left-to-right  (wide, suits landscape/desktop)
 *   - kurbanChartTD  : vertical,   top-to-bottom  (tall, suits portrait/mobile)
 */

// ─── Shared node style helpers ───────────────────────────────────────────────
const LA = "text-align:left;"; // left-align
const LAN = "text-align:left; white-space:nowrap;"; // left-align + no-wrap

// ─── Shared class definitions ─────────────────────────────────────────────────
const classDefs = `
    classDef blue    fill:#eff6ff,stroke:#3b82f6,color:#1e40af,stroke-width:2px;
    classDef rose    fill:#fff1f2,stroke:#f43f5e,color:#9f1239,stroke-width:2px;
    classDef emerald fill:#ecfdf5,stroke:#10b981,color:#065f46,stroke-width:2px;
    classDef indigo  fill:#eef2ff,stroke:#6366f1,color:#3730a3,stroke-width:2px;

    class T1 blue;
    class Jagal,TimPotong,JK,JS,JU rose;
    class JK_Proc,JS_Proc,JU_Proc emerald;
    class JK_ST,JS_ST,JU_ST,Shohibul,Warga,Requester indigo;
`;

// ─── Horizontal (Left → Right) ───────────────────────────────────────────────
export const kurbanChartLR = `
graph LR
    subgraph S1 [<b>Penerimaan Hewan Kurban</b>]
        T1["<div style='${LAN}'><b>Hewan Qurban</b><br/><br/>Pelaksana: <b>Tim Pengadaan &<br/>Penerimaan Hewan Kurban</b></div>"]
    end

    subgraph S2 [<b>Penyembelihan & Pemotongan Hewan Kurban</b>]
        T1 --> Jagal{Penyembelihan &<br/>Pemisahan Daging-Tulang<br/><br/>Pelaksana: <b>Tim Jagal Profesional</b>}
        Jagal --> TimPotong["<div style='${LAN}'>Pemotongan Daging, Jeroan & Organ<br/><br/>Pelaksana: <b>Tim Pemotongan</b></div>"]
        TimPotong --> JK["<div style='${LAN}'><b>Jalur Khusus</b><br/><br/>Kepala & Kokot</div>"]
        TimPotong --> JS["<div style='${LAN}'><b>Jalur Sampil</b><br/><br/>Paket Utama: 3.5 kg<br/>Paket Request: Iga / Limpa / Hati</div>"]
        TimPotong --> JU["<div style='${LAN}'><b>Jalur Umum</b><br/><br/>Daging: 0.6 kg Sapi / 0.5 kg Kambing<br/>Tambahan: Lemak / Jeroan / Tulangan</div>"]
    end

    subgraph S3 [<b>Penimbangan & Pengemasan Paket</b>]
        JK --> JK_Proc["<div style='${LAN}'>Pengelompokan & Pengemasan<br/><br/>Pelaksana: <b>Tim Khusus</b></div>"]
        JS --> JS_Proc["<div style='${LAN}'>Penimbangan & Pengemasan<br/><br/>Pelaksana: <b>Tim Pengawasan Sampil & Mudhohi</b></div>"]
        JU --> JU_Proc["<div style='${LAN}'>Penimbangan & Pengemasan<br/><br/>Pelaksana: <b>Tim Penimbangan & Penghitungan</b></div>"]
    end

    subgraph S4 [<b>Distribusi Paket Kurban</b>]
        JK_Proc --> JK_ST["<div style='${LAN}'>Serah Terima Paket Kurban<br/><br/>Pelaksana: <b>Tim Khusus</b></div>"]
        JS_Proc --> JS_ST["<div style='${LAN}'>Serah Terima Paket Kurban<br/><br/>Pelaksana: <b>Tim Pengawasan Sampil & Mudhohi</b></div>"]
        JU_Proc --> JU_ST["<div style='${LAN}'>Serah Terima Paket Kurban<br/><br/>Pelaksana: <b>Tim Pendistribusian Daging</b></div>"]
        JK_ST --> Requester["<div style='${LAN}'><b>Pihak yang Request</b></div>"]
        JS_ST --> Shohibul["<div style='${LAN}'><b>Shohibul Qurban</b></div>"]
        JU_ST --> Warga["<div style='${LAN}'><b>Mustahiq / Warga</b></div>"]
    end
${classDefs}`;

// ─── Vertical (Top → Down) ─────────────────────────────────────────────────
export const kurbanChartTD = `
graph TD
    subgraph S1 [<b>Penerimaan Hewan Kurban</b>]
        T1["<div style='${LAN}'>Hewan Qurban<br/><br/>Pelaksana: <b>Tim Pengadaan & Penerimaan Hewan Kurban</b></div>"]
    end

    subgraph S2 [<b>Penyembelihan & Pemotongan Hewan Kurban</b>]
        Jagal{Penyembelihan &<br/>Pemisahan Daging-Tulang<br/><br/>Pelaksana: <b>Tim Jagal Profesional</b>}
        TimPotong["<div style='${LAN}'>Pemotongan Daging, Jeroan & Organ<br/><br/>Pelaksana: <b>Tim Pemotongan Daging Kurban</b></div>"]
        JK["<div style='${LAN}'><b>Jalur Khusus</b><br/><br/>Kepala & Kokot</div>"]
        JS["<div style='${LAN}'><b>Jalur Sampil</b><br/><br/>Paket Utama: 3.5 kg <br/> Paket Request: Iga/Limpa/Hati</div>"]
        JU["<div style='${LAN}'><b>Jalur Umum</b><br/><br/>Daging: 0.6 kg Sapi / 0.5 kg Kambing <br/>Tambahan: Lemak / Jeroan / Tulangan</div>"]
    end

    subgraph S3 [<b>Penimbangan & Pengemasan Paket Kurban</b>]
        JK_Proc["<div style='${LAN}'>Pengelompokan & Pengemasan<br/><br/>Pelaksana: <b>Tim Khusus</b></div>"]
        JS_Proc["<div style='${LAN}'>Penimbangan & Pengemasan<br/><br/>Pelaksana: <b>Tim Pengawasan Sampil & Mudhohi</b></div>"]
        JU_Proc["<div style='${LAN}'>Penimbangan & Pengemasan<br/><br/>Pelaksana: <b>Tim Penimbangan & Penghitungan</b></div>"]
    end

    subgraph S4 [<b>Distribusi Paket Kurban</b>]
        JK_ST["<div style='${LAN}'>Serah Terima Paket Kurban<br/><br/> Pelaksana: <b>Tim Khusus</b></div>"]
        JS_ST["<div style='${LAN}'>Serah Terima Paket Kurban<br/><br/> Pelaksana: <b>Tim Pengawasan Sampil & Mudhohi</b></div>"]
        JU_ST["<div style='${LAN}'>Serah Terima Paket Kurban<br/><br/> Pelaksana: <b>Tim Pendistribusian Daging Kurban</b></div>"]
        Requester["<div style='${LAN}'><b>Pihak yang Request</b></div>"]
        Shohibul["<div style='${LAN}'><b>Shohibul Qurban</b></div>"]
        Warga["<div style='${LAN}'><b>Mustahiq / Warga</b></div>"]
    end

    T1 --> Jagal
    Jagal --> TimPotong
    TimPotong --> JK
    TimPotong --> JS
    TimPotong --> JU
    JK --> JK_Proc
    JS --> JS_Proc
    JU --> JU_Proc
    JK_Proc --> JK_ST
    JS_Proc --> JS_ST
    JU_Proc --> JU_ST
    JK_ST --> Requester
    JS_ST --> Shohibul
    JU_ST --> Warga
${classDefs}`;
