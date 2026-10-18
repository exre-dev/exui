"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime, useExampleFilter, createExampleRandom, type ExampleTimers } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { LoaderCircleIcon } from "lucide-react"
const AutocompletePrimitive = { useFilter: useExampleFilter }
const exampleRandom = createExampleRandom("c-autocomplete-9")
import { type ReactNode, useEffect, useState } from "react"
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompleteStatus,
} from "@exre/exui"


import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"


  function OriginalPattern() {
  const {format: formatExample,  copy: copyExample, timers: exampleTimers } = useExampleRuntime()

  const [searchValue, setSearchValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<Developer[]>([])
  const [error, setError] = useState<string | null>(null)

  const { contains } = AutocompletePrimitive.useFilter({ sensitivity: "base" })

  useEffect(() => {
    if (!searchValue) {
      setSearchResults([])
      setIsLoading(false)
      return undefined
    }

    setIsLoading(true)
    setError(null)

    let ignore = false

    async function fetchDevelopers() {
      try {
        const results = await searchDevelopers(searchValue, contains, exampleTimers)
        if (!ignore) {
          setSearchResults(results)
        }
      } catch {
        if (!ignore) {
          setError("Failed to fetch developers. Please try again.")
          setSearchResults([])
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    const timeoutId = exampleTimers.setTimeout(fetchDevelopers, 300)

    return () => {
      clearTimeout(timeoutId)
      ignore = true
    }
  }, [searchValue, contains, exampleTimers])

  let status: ReactNode = ""

  if (isLoading) {
    status = (
      <div className="flex items-center gap-2">
        <LoaderCircleIcon className="size-4 animate-spin" aria-hidden />
        {<ExampleText>Searching developers... </ExampleText>}</div>
    )
  } else if (error) {
    status = error
  } else if (searchResults.length === 0 && searchValue) {
    status = formatExample("No developers found for \"{query}\"", { query: searchValue })
  } else if (searchResults.length > 0) {
    status = formatExample(searchResults.length === 1 ? "{count} developer found" : "{count} developers found", { count: searchResults.length })
  } else if (!searchValue) {
    status = "Start typing to search developers..."
  }

  const shouldRenderPopup = searchValue !== ""

  return (
    <div className="w-full max-w-xs">
      <Autocomplete
        items={searchResults}
        value={searchValue}
        onValueChange={setSearchValue}
        itemToStringValue={(item: unknown) => (item as Developer).name}
        filter={null}
      >
        <AutocompleteInput
          placeholder={copyExample("e.g. John Smith, React, San Francisco")}
          showTrigger
          showClear
        />
        {<ExampleText>{shouldRenderPopup && (
          <AutocompleteContent>
            <AutocompleteStatus>{<ExampleText><>{typeof status === "string" ? copyExample(status) : status}</></ExampleText>}</AutocompleteStatus>
            <AutocompleteList>
              {(developer: Developer) => (
                <ExampleRuntimeConsumer key={developer.id} render={({copy: copyExample}) => (<AutocompleteItem
                  key={developer.id}
                  value={developer}
                  className="rounded-lg"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Avatar className="size-9">
                      <AvatarImage
                        src={developer.avatar}
                        alt={copyExample(developer.name)}
                      />
                      <AvatarFallback>
                        {<ExampleText>{developer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}</ExampleText>}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">
                        {<ExampleText>{developer.name}</ExampleText>}
                      </div>
                      <div className="text-muted-foreground truncate text-sm">
                        {<ExampleText>{developer.role}</ExampleText>} • {<ExampleText>{developer.location}</ExampleText>}
                      </div>
                    </div>
                  </div>
                </AutocompleteItem>)} />
              )}
            </AutocompleteList>
          </AutocompleteContent>
        )}</ExampleText>}
      </Autocomplete>
    </div>
  )
}

async function searchDevelopers(
  query: string,
  filter: (item: string, query: string) => boolean, exampleTimers: ExampleTimers
): Promise<Developer[]> {
  // Simulate network delay
  await new Promise((resolve) => {
    exampleTimers.setTimeout(resolve, exampleRandom() * 800 + 200)
  })

  // Simulate occasional network errors (2% chance)
  if (exampleRandom() < 0.02 || query === "error") {
    throw new Error("Network error")
  }

  return topDevelopers.filter(
    (developer) =>
      filter(developer.name, query) ||
      filter(developer.role, query) ||
      filter(developer.location, query) ||
      developer.skills.some((skill) => filter(skill, query))
  )
}

interface Developer {
  id: string
  name: string
  role: string
  location: string
  skills: string[]
  experience: number
  rating: number
  avatar: string
}

const topDevelopers: Developer[] = [
  {
    id: "1",
    name: "Alex Chen",
    role: "Senior Full-Stack Developer",
    location: "San Francisco, CA",
    skills: ["React", "Node.js", "TypeScript", "AWS", "Docker"],
    experience: 8,
    rating: 4.9,
    avatar: "/examples/reui/photos/4342c8343f38562388.jpg",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    role: "Frontend Architect",
    location: "New York, NY",
    skills: ["Vue.js", "JavaScript", "CSS", "Webpack", "Figma"],
    experience: 10,
    rating: 4.8,
    avatar: "/examples/reui/photos/f0fb6d9fa4dd3c2a9e.jpg",
  },
  {
    id: "3",
    name: "Michael Rodriguez",
    role: "Backend Engineer",
    location: "Austin, TX",
    skills: ["Python", "Django", "PostgreSQL", "Redis", "Kubernetes"],
    experience: 6,
    rating: 4.7,
    avatar: "/examples/reui/photos/d28200d97f109ef7bd.jpg",
  },
  {
    id: "4",
    name: "Emily Wang",
    role: "DevOps Engineer",
    location: "Seattle, WA",
    skills: ["AWS", "Terraform", "Jenkins", "Docker", "Linux"],
    experience: 7,
    rating: 4.9,
    avatar: "/examples/reui/photos/26b2d8e69e31afd55b.jpg",
  },
  {
    id: "5",
    name: "David Kim",
    role: "Mobile Developer",
    location: "Los Angeles, CA",
    skills: ["React Native", "Swift", "Kotlin", "Firebase", "GraphQL"],
    experience: 5,
    rating: 4.6,
    avatar: "/examples/reui/photos/b52fd343cddf0caa04.jpg",
  },
  {
    id: "6",
    name: "Lisa Thompson",
    role: "Data Engineer",
    location: "Boston, MA",
    skills: ["Python", "Spark", "Airflow", "Snowflake", "dbt"],
    experience: 9,
    rating: 4.8,
    avatar: "/examples/reui/photos/2bbeb95380bb9d2d09.jpg",
  },
  {
    id: "7",
    name: "James Wilson",
    role: "Cloud Solutions Architect",
    location: "Chicago, IL",
    skills: ["AWS", "Azure", "Terraform", "Kubernetes", "Microservices"],
    experience: 12,
    rating: 4.9,
    avatar: "/examples/reui/photos/c21a444cce1a796d39.jpg",
  },
  {
    id: "8",
    name: "Maria Garcia",
    role: "UI/UX Developer",
    location: "Miami, FL",
    skills: ["React", "Figma", "CSS-in-JS", "Storybook", "Accessibility"],
    experience: 4,
    rating: 4.5,
    avatar: "/examples/reui/photos/061a1e14d562d22b1a.jpg",
  },
  {
    id: "9",
    name: "Robert Taylor",
    role: "Machine Learning Engineer",
    location: "Denver, CO",
    skills: ["Python", "TensorFlow", "PyTorch", "MLOps", "Docker"],
    experience: 6,
    rating: 4.7,
    avatar: "/examples/reui/photos/b07d4d0875fa8ba405.jpg",
  },
  {
    id: "10",
    name: "Jennifer Lee",
    role: "Blockchain Developer",
    location: "San Diego, CA",
    skills: ["Solidity", "Web3.js", "Ethereum", "Smart Contracts", "Rust"],
    experience: 5,
    rating: 4.6,
    avatar: "/examples/reui/photos/15b65855433f942355.jpg",
  },
  {
    id: "11",
    name: "Christopher Brown",
    role: "Security Engineer",
    location: "Portland, OR",
    skills: ["Cybersecurity", "Penetration Testing", "OWASP", "SIEM", "Python"],
    experience: 8,
    rating: 4.8,
    avatar: "/examples/reui/photos/1312ce123c18a93b29.jpg",
  },
  {
    id: "12",
    name: "Amanda Davis",
    role: "Game Developer",
    location: "Orlando, FL",
    skills: ["Unity", "C#", "Unreal Engine", "3D Modeling", "VR/AR"],
    experience: 7,
    rating: 4.7,
    avatar: "/examples/reui/photos/1f13cfba5372a5a343.jpg",
  },
  {
    id: "13",
    name: "Kevin Zhang",
    role: "AI Research Engineer",
    location: "Palo Alto, CA",
    skills: ["Python", "PyTorch", "Transformers", "NLP", "Computer Vision"],
    experience: 6,
    rating: 4.9,
    avatar: "/examples/reui/photos/56505d15eb15a8386f.jpg",
  },
  {
    id: "14",
    name: "Rachel Green",
    role: "QA Automation Engineer",
    location: "Phoenix, AZ",
    skills: ["Selenium", "Cypress", "Jest", "Python", "Test Automation"],
    experience: 5,
    rating: 4.6,
    avatar: "/examples/reui/photos/fa633a17792c16d3d0.jpg",
  },
  {
    id: "15",
    name: "Daniel Martinez",
    role: "System Administrator",
    location: "Dallas, TX",
    skills: [
      "Linux",
      "Windows Server",
      "Active Directory",
      "PowerShell",
      "VMware",
    ],
    experience: 10,
    rating: 4.8,
    avatar: "/examples/reui/photos/a36f6e5451cbbf0917.jpg",
  },
  {
    id: "16",
    name: "Sophie Anderson",
    role: "Product Manager",
    location: "San Jose, CA",
    skills: [
      "Product Strategy",
      "Agile",
      "Analytics",
      "User Research",
      "Figma",
    ],
    experience: 8,
    rating: 4.7,
    avatar: "/examples/reui/photos/4a39d3ea9365eb0cac.jpg",
  },
  {
    id: "17",
    name: "Mark Thompson",
    role: "Database Administrator",
    location: "Atlanta, GA",
    skills: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Performance Tuning"],
    experience: 11,
    rating: 4.9,
    avatar: "/examples/reui/photos/22ab94dabe1a5382cd.jpg",
  },
  {
    id: "18",
    name: "Jessica White",
    role: "Technical Writer",
    location: "Raleigh, NC",
    skills: [
      "Technical Writing",
      "Markdown",
      "API Documentation",
      "Git",
      "Confluence",
    ],
    experience: 6,
    rating: 4.5,
    avatar: "/examples/reui/photos/fea73a77a1afde4456.jpg",
  },
  {
    id: "19",
    name: "Andrew Clark",
    role: "Site Reliability Engineer",
    location: "Nashville, TN",
    skills: [
      "Monitoring",
      "Incident Response",
      "Python",
      "Terraform",
      "Kubernetes",
    ],
    experience: 7,
    rating: 4.8,
    avatar: "/examples/reui/photos/74e83c28d9f60165b7.jpg",
  },
  {
    id: "20",
    name: "Nicole Taylor",
    role: "Frontend Developer",
    location: "Minneapolis, MN",
    skills: ["Angular", "TypeScript", "RxJS", "SCSS", "Jest"],
    experience: 4,
    rating: 4.6,
    avatar: "/examples/reui/photos/680905eed473f03053.jpg",
  },
  {
    id: "21",
    name: "Ryan Murphy",
    role: "Backend Developer",
    location: "Kansas City, MO",
    skills: ["Java", "Spring Boot", "Microservices", "MongoDB", "Docker"],
    experience: 6,
    rating: 4.7,
    avatar: "/examples/reui/photos/32ef49fd928350fdcd.jpg",
  },
  {
    id: "22",
    name: "Stephanie Lewis",
    role: "Full-Stack Developer",
    location: "Salt Lake City, UT",
    skills: ["React", "Node.js", "GraphQL", "PostgreSQL", "AWS"],
    experience: 5,
    rating: 4.6,
    avatar: "/examples/reui/photos/6a23a44cfa1f6513bb.jpg",
  },
  {
    id: "23",
    name: "Brandon Wright",
    role: "Cloud Engineer",
    location: "Las Vegas, NV",
    skills: ["AWS", "Terraform", "Docker", "Kubernetes", "Python"],
    experience: 8,
    rating: 4.8,
    avatar: "/examples/reui/photos/d24e3b963979d19d16.jpg",
  },
  {
    id: "24",
    name: "Ashley Hall",
    role: "DevOps Engineer",
    location: "Columbus, OH",
    skills: ["CI/CD", "Jenkins", "GitLab", "Docker", "AWS"],
    experience: 6,
    rating: 4.7,
    avatar: "/examples/reui/photos/9b0f719279d1af83b9.jpg",
  },
  {
    id: "25",
    name: "Tyler Young",
    role: "Mobile App Developer",
    location: "Tampa, FL",
    skills: ["Flutter", "Dart", "Firebase", "REST APIs", "Git"],
    experience: 4,
    rating: 4.5,
    avatar: "/examples/reui/photos/d3f84cfec347aa987c.jpg",
  },
]

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
