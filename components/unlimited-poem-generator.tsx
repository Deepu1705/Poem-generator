'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Loader2, Plus, Minus, RefreshCw, Download } from "lucide-react"

export function UnlimitedPoemGeneratorComponent() {
  const [topic, setTopic] = useState('')
  const [verses, setVerses] = useState(4)
  const [poem, setPoem] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('') // Error state for user-friendly messages

  const generatePoem = async () => {
    setIsGenerating(true)
    setError('') // Clear previous error

    // Create the prompt to be sent to the backend
    const prompt = `Write a ${verses}-verse poem about ${topic}.`

    try {
      const response = await fetch('/api/generatePoem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }), // Send the formatted prompt to the API
      })

      const data = await response.json()

      if (response.ok) {
        setPoem(data.poem)
      } else {
        setError(data.error || 'Error generating poem')
        setPoem('')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('An unexpected error occurred. Please try again.')
      setPoem('')
    } finally {
      setIsGenerating(false)
    }
  }

  const addVerse = () => setVerses(prev => prev + 1)
  const removeVerse = () => verses > 1 && setVerses(prev => prev - 1)

  const downloadPoem = () => {
    const element = document.createElement('a')
    const file = new Blob([poem], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = 'Ethereal_Poem.txt'
    document.body.appendChild(element)
    element.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden">
        <div className="p-8 space-y-8">
          <h1 className="text-4xl font-bold text-center text-white mb-6">Ethereal Poem Generator</h1>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <Label htmlFor="topic" className="text-lg font-medium text-white mb-2 block">Your Inspiration</Label>
                <Input
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter a topic"
                  className="w-full bg-white/20 text-white placeholder-gray-300 border-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>
              <div>
                <Label htmlFor="verses" className="text-lg font-medium text-white mb-2 block">Verses</Label>
                <div className="flex items-center space-x-4">
                  <Button 
                    onClick={removeVerse} 
                    disabled={verses <= 1 || isGenerating}
                    className="bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-2xl font-bold text-white">{verses}</span>
                  <Button 
                    onClick={addVerse}
                    disabled={isGenerating}
                    className="bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button 
                onClick={generatePoem} 
                disabled={isGenerating || !topic} 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg py-3 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Weaving Poetic Magic...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Ethereal Poem
                  </>
                )}
              </Button>
              {error && <p className="text-red-500">{error}</p>}
            </div>

            <AnimatePresence>
              {poem && (
                <motion.div
                  key={poem}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/20 backdrop-blur-md p-6 rounded-lg shadow-lg overflow-hidden"
                >
                  <h2 className="text-2xl font-serif mb-4 text-white">Your Ethereal Poem</h2>
                  <Textarea
                    value={poem}
                    onChange={(e) => setPoem(e.target.value)}
                    className="w-full h-64 bg-transparent text-white border-none focus:ring-0 font-serif text-lg resize-none"
                    readOnly
                  />
                  <div className="flex justify-end space-x-4 mt-4">
                    <Button
                      onClick={generatePoem}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                    <Button
                      onClick={downloadPoem}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
