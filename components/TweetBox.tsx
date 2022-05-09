import React, { useState, useRef } from 'react'
import {
  CalendarIcon,
  EmojiHappyIcon,
  LocationMarkerIcon,
  PhotographIcon,
  SearchCircleIcon,
} from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'
import { Tweet, TweetBody } from '../typings'
import { fetchTweets } from '../utils/fetchTweets'
import toast from 'react-hot-toast'

interface Props {
  setTweets: React.Dispatch<React.SetStateAction<Tweet[]>>
}

const TweetBox = ({ setTweets }: Props) => {
  const [input, setInput] = useState<string>('')
  const [imageUrlBoxIsOpen, setImageUrlBoxIsOpen] = useState<boolean>(false)
  const [image, setImage] = useState<string>('')
  const imageInputRef = useRef<HTMLInputElement>(null)
  const { data: session } = useSession()
  // console.log(session)

  const addImageToTweet = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()

    if (!imageInputRef.current?.value) return setImage('')

    setImage(imageInputRef.current?.value)
    imageInputRef.current.value = ''
    setImageUrlBoxIsOpen(false)
  }

  const postTweet = async () => {
    const tweetInfo: TweetBody = {
      text: input,
      username: session?.user?.name || 'Unknown User',
      profileImg: session?.user?.image || 'https://links.papareact.com/gll',
      image: image,
    }

    const result = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/addTweet`,
      {
        body: JSON.stringify(tweetInfo),
        method: 'POST',
      }
    )

    const json = await result.json()

    console.log(json)

    const newTweets = await fetchTweets()
    setTweets(newTweets)

    toast('Tweet posted', {
      icon: '🚀',
    })
    return json
  }

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()

    postTweet()

    setInput('')
    setImage('')
    setImageUrlBoxIsOpen(false)
  }
  return (
    <div className="flex items-center space-x-2 p-5">
      <img
        className="mt-4 h-14 w-14 rounded-full object-cover"
        src={session?.user?.image || 'https://links.papareact.com/gll'}
        alt="profile photo"
      />
      <div className="flex flex-1 items-center pl-2">
        <form className="flex flex-1 flex-col">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            className="h-24 w-full text-xl outline-none placeholder:text-xl"
            type="text"
            placeholder="What's Happening"
          />
          <div className="flex items-center">
            <div className="flex flex-1 space-x-2 text-twitter">
              <PhotographIcon
                onClick={() => setImageUrlBoxIsOpen((prev) => !prev)}
                className="h-5 w-5 cursor-pointer transition-transform duration-200 ease-out hover:scale-150"
              />
              <SearchCircleIcon className="h-5 w-5" />
              <EmojiHappyIcon className="h-5 w-5" />
              <CalendarIcon className="h-5 w-5" />
              <LocationMarkerIcon className="h-5 w-5" />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!input || !session}
              className="rounded-full bg-twitter px-5 py-2 font-bold text-white disabled:opacity-40"
            >
              Tweet
            </button>
          </div>
          {imageUrlBoxIsOpen && (
            <form className="mt-5 flex rounded-lg bg-twitter/80 py-2 px-4">
              <input
                ref={imageInputRef}
                className="flex-1 bg-transparent p-2 text-white outline-none placeholder:text-white"
                type="text"
                placeholder="Enter Image URL..."
              />
              <button
                type="submit"
                onClick={addImageToTweet}
                className="font-bold text-white"
              >
                Add Image
              </button>
            </form>
          )}
          {image && (
            <img
              className="mt-10 h-40 w-full rounded-xl object-contain shadow-xl"
              src={image}
              alt="invalid pic"
            />
          )}
        </form>
      </div>
    </div>
  )
}

export default TweetBox
