import 'dotenv/config'
import fetch from 'node-fetch'
import fs from 'fs/promises'
import path from 'path'

/**
 * 3D Model Generator - Meshy + Tripo3D API
 * Generates models from both APIs and downloads them for comparison
 */

// Configuration
const MESHY_API_KEY = process.env.MESHY_API_KEY
const TRIPO_API_KEY = process.env.TRIPO_API_KEY
const MODELS_DIR = './public/assets/models'

// Ensure models directory exists
await fs.mkdir(MODELS_DIR, { recursive: true })

/**
 * Generate with Meshy API
 */
async function generateMeshy(prompt, negativePrompt = '') {
    console.log('🎨 [Meshy] Starting generation...')

    const response = await fetch('https://api.meshy.ai/v2/text-to-3d', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${MESHY_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            mode: 'preview', // 'preview' (fast) or 'refine' (slow but high quality)
            prompt: prompt,
            art_style: 'anime',
            negative_prompt: negativePrompt || 'realistic, photorealistic, hyperrealistic, low quality'
        })
    })

    const { result } = await response.json()
    console.log(`✅ [Meshy] Task created: ${result}`)

    // Poll for completion
    return pollMeshyTask(result)
}

async function pollMeshyTask(taskId) {
    let attempts = 0
    const maxAttempts = 60 // 5 minutes max

    while (attempts < maxAttempts) {
        const response = await fetch(`https://api.meshy.ai/v2/text-to-3d/${taskId}`, {
            headers: { 'Authorization': `Bearer ${MESHY_API_KEY}` }
        })

        const data = await response.json()

        if (data.status === 'SUCCEEDED') {
            console.log('✅ [Meshy] Generation complete!')
            return data.model_urls.glb
        } else if (data.status === 'FAILED') {
            throw new Error(`Meshy generation failed: ${data.error}`)
        }

        console.log(`⏳ [Meshy] Progress: ${data.progress || 0}%`)
        await new Promise(resolve => setTimeout(resolve, 5000)) // Wait 5s
        attempts++
    }

    throw new Error('Meshy generation timeout')
}

/**
 * Generate with Tripo3D API
 */
async function generateTripo(prompt) {
    console.log('🚀 [Tripo3D] Starting generation...')

    const response = await fetch('https://api.tripo3d.ai/v2/openapi/task', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${TRIPO_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: 'text_to_model',
            prompt: prompt,
            model_version: 'v2.0-20240919'
        })
    })

    const { data } = await response.json()
    console.log(`✅ [Tripo3D] Task created: ${data.task_id}`)

    // Poll for completion
    return pollTripoTask(data.task_id)
}

async function pollTripoTask(taskId) {
    let attempts = 0
    const maxAttempts = 40 // Tripo is faster: 3-4 minutes max

    while (attempts < maxAttempts) {
        const response = await fetch(`https://api.tripo3d.ai/v2/openapi/task/${taskId}`, {
            headers: { 'Authorization': `Bearer ${TRIPO_API_KEY}` }
        })

        const { data } = await response.json()

        if (data.status === 'success') {
            console.log('✅ [Tripo3D] Generation complete!')
            return data.output.model // GLB download URL
        } else if (data.status === 'failed') {
            throw new Error(`Tripo3D generation failed: ${data.error}`)
        }

        console.log(`⏳ [Tripo3D] Status: ${data.status}`)
        await new Promise(resolve => setTimeout(resolve, 5000)) // Wait 5s
        attempts++
    }

    throw new Error('Tripo3D generation timeout')
}

/**
 * Download file from URL
 */
async function downloadModel(url, filename) {
    console.log(`📥 Downloading ${filename}...`)

    const response = await fetch(url)
    const buffer = await response.arrayBuffer()
    const filePath = path.join(MODELS_DIR, filename)

    await fs.writeFile(filePath, Buffer.from(buffer))
    console.log(`✅ Saved to ${filePath}`)

    return filePath
}

/**
 * Main execution
 */
async function main() {
    const prompt = process.argv[2] || `
8-year-old Nico Robin from One Piece, child archaeologist,
long black hair with straight bangs, blue eyes,
purple sleeveless dress, holding ancient book,
calm intelligent expression,
anime cel-shaded style, clean topology, T-pose,
full body character, game-ready low-poly,
Studio Ghibli inspired, soft colors
  `.trim()

    const negativePrompt = 'realistic, photorealistic, hyperrealistic, adult, teenager, low quality, deformed, blurry'

    console.log(`🎯 Prompt: ${prompt}\n`)

    try {
        // Generate with both APIs in parallel
        const [meshyUrl, tripoUrl] = await Promise.all([
            generateMeshy(prompt, negativePrompt),
            generateTripo(prompt)
        ])

        // Download both models
        await Promise.all([
            downloadModel(meshyUrl, 'robin-meshy.glb'),
            downloadModel(tripoUrl, 'robin-tripo.glb')
        ])

        console.log('\n🎉 Both models generated successfully!')
        console.log('📂 Check ./public/assets/models/')
        console.log('\n🔄 Next: Reload your dev server to see the models')

    } catch (error) {
        console.error('❌ Error:', error.message)
        process.exit(1)
    }
}

// Check API keys
if (!MESHY_API_KEY || !TRIPO_API_KEY) {
    console.error('❌ Missing API keys in .env file')
    console.log('\nCreate a .env file with:')
    console.log('MESHY_API_KEY=your_meshy_key')
    console.log('TRIPO_API_KEY=your_tripo_key')
    process.exit(1)
}

main()
