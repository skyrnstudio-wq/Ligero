import Foundation
import CoreImage
import Vision

let args = CommandLine.arguments
guard args.count >= 3, let ciImage = CIImage(contentsOf: URL(fileURLWithPath: args[1])) else {
    FileHandle.standardError.write("usage: cutout.swift <input> <output.png>\n".data(using: .utf8)!)
    exit(1)
}

let handler = VNImageRequestHandler(ciImage: ciImage, orientation: .up)
let request = VNGenerateForegroundInstanceMaskRequest()

do {
    try handler.perform([request])
    guard let result = request.results?.first, !result.allInstances.isEmpty else {
        FileHandle.standardError.write("no foreground subject found\n".data(using: .utf8)!)
        exit(2)
    }
    let buffer = try result.generateMaskedImage(ofInstances: result.allInstances, from: handler, croppedToInstancesExtent: false)
    let masked = CIImage(cvPixelBuffer: buffer)
    let context = CIContext()
    let sRGB = CGColorSpace(name: CGColorSpace.sRGB)!
    try context.writePNGRepresentation(of: masked, to: URL(fileURLWithPath: args[2]), format: .RGBA8, colorSpace: sRGB)
    print("wrote \(args[2])")
} catch {
    FileHandle.standardError.write("failed: \(error)\n".data(using: .utf8)!)
    exit(3)
}
