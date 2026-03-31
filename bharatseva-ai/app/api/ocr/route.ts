import { NextRequest, NextResponse } from "next/server"
import { createWorker } from "tesseract.js"

export const runtime = "nodejs"

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/)
  if (!match) {
    throw new Error("Unsupported document payload")
  }

  return {
    mimeType: match[1],
    buffer: Buffer.from(match[2], "base64"),
  }
}

function extractKeyInformation(text: string) {
  const compactText = text.replace(/\s+/g, " ").trim()

  const nameMatch = compactText.match(
    /(?:Name|NAME|Given Name|Holder Name)[:\s-]+([A-Z][A-Z\s]{2,})/
  )
  const dobMatch = compactText.match(
    /(?:DOB|Date of Birth|Birth)[:\s-]+(\d{2}[\/.-]\d{2}[\/.-]\d{2,4})/
  )
  const aadhaarMatch = compactText.match(/\b\d{4}\s?\d{4}\s?\d{4}\b/)
  const panMatch = compactText.match(/\b[A-Z]{5}\d{4}[A-Z]\b/)
  const passportMatch = compactText.match(/\b[A-Z]\d{7}\b/)
  const licenseMatch = compactText.match(/\b[A-Z]{2}\d{2}\s?\d{11,13}\b/)
  const pincodeMatch = compactText.match(/\b\d{6}\b/)

  return {
    name: nameMatch?.[1]?.trim() || "",
    date_of_birth: dobMatch?.[1] || "",
    aadhaar_number: aadhaarMatch?.[0] || "",
    pan_number: panMatch?.[0] || "",
    passport_number: passportMatch?.[0] || "",
    driving_license_number: licenseMatch?.[0] || "",
    pincode: pincodeMatch?.[0] || "",
  }
}

function buildFormMapping(keyInformation: Record<string, string>) {
  return {
    full_name: keyInformation.name,
    date_of_birth: keyInformation.date_of_birth,
    aadhaar: keyInformation.aadhaar_number,
    pan: keyInformation.pan_number,
    passport: keyInformation.passport_number,
    driving_license: keyInformation.driving_license_number,
    pincode: keyInformation.pincode,
  }
}

export async function POST(request: NextRequest) {
  let worker: Awaited<ReturnType<typeof createWorker>> | null = null

  try {
    const { imageData, documentType, targetForm } = await request.json()

    if (!imageData) {
      return NextResponse.json({ error: "Image data is required." }, { status: 400 })
    }

    const { mimeType, buffer } = parseDataUrl(imageData)

    if (!mimeType.startsWith("image/")) {
      return NextResponse.json(
        { error: "This OCR workflow currently supports image uploads only." },
        { status: 400 }
      )
    }

    worker = await createWorker("eng")
    const result = await worker.recognize(buffer)
    const extractedText = result.data.text.replace(/\n{3,}/g, "\n\n").trim()

    const keyInformation = extractKeyInformation(extractedText)
    const formMapping = buildFormMapping(keyInformation)
    const populatedFields = Object.values(formMapping).filter(Boolean).length
    const completeness = Math.round((populatedFields / Object.keys(formMapping).length) * 100)

    const issues: string[] = []
    if (extractedText.length < 50) {
      issues.push("The image text is limited. Upload a sharper, front-facing photo.")
    }
    if (!keyInformation.name) {
      issues.push("Name could not be confidently extracted.")
    }
    if (
      documentType === "aadhaar" &&
      !keyInformation.aadhaar_number
    ) {
      issues.push("Aadhaar number was not detected.")
    }
    if (documentType === "pan" && !keyInformation.pan_number) {
      issues.push("PAN number was not detected.")
    }

    return NextResponse.json({
      ocrResults: {
        extractedText,
        keyInformation,
        formMapping,
        validation: {
          isValid: issues.length === 0,
          completeness,
          issues,
        },
      },
      analysis: `OCR completed for ${documentType || "document"}${
        targetForm ? ` and mapped for ${targetForm}` : ""
      }.`,
      timestamp: new Date().toISOString(),
      source: "tesseract.js",
    })
  } catch (error) {
    console.error("Document OCR API error:", error)
    return NextResponse.json(
      { error: "Failed to process document." },
      { status: 500 }
    )
  } finally {
    await worker?.terminate()
  }
}

export async function GET() {
  return NextResponse.json({
    documents: [
      {
        type: "aadhaar",
        name: "Aadhaar Card",
        fields: ["name", "dob", "aadhaar_number", "address"],
      },
      {
        type: "pan",
        name: "PAN Card",
        fields: ["name", "father_name", "dob", "pan_number"],
      },
      {
        type: "driving_license",
        name: "Driving License",
        fields: ["name", "dob", "driving_license_number", "address"],
      },
      {
        type: "passport",
        name: "Passport",
        fields: ["name", "passport_number", "dob", "issue_date"],
      },
    ],
    forms: [
      {
        name: "PM-KISAN Registration",
        required_fields: ["full_name", "date_of_birth", "aadhaar", "pincode"],
      },
      {
        name: "Ayushman Bharat Registration",
        required_fields: ["full_name", "date_of_birth", "aadhaar", "pincode"],
      },
      {
        name: "PAN Application",
        required_fields: ["full_name", "date_of_birth", "pincode"],
      },
    ],
  })
}
