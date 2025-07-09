"use client";

import { useRouter } from 'next/navigation'; // Use next/navigation for client-side routing
import React from 'react';

const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL as string 
interface DeleteButtonProps {
  slug: string;

}

const DeleteButton: React.FC<DeleteButtonProps> = ({ slug }) => {
  const router = useRouter();

  const handleDelete = async () => {
    // 1. Ask for confirmation
    if (!window.confirm('Do you really want to delete this post? This action cannot be undone.')) {
      return; // User cancelled
    }

    const API_URL = `${WEB_URL}/api/posts/${slug}`

   try {

      const response = await fetch(API_URL, { 
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete post');
      }

      alert('Post deleted successfully!');
      router.push('/'); 
      router.refresh(); 

    } catch (error) {
      console.log('Error deleting post:', error);
      alert(`Error deleting post: ${error || 'An unexpected error occurred.'}`);
    }
      
  };

  return (
    <p
      onClick={handleDelete} 
      className="text-sm border border-gray-100 px-2 py-1 rounded-lg cursor-pointer text-gray-100 bg-red-800 hover:bg-red-900 hover:text-gray-300 grid"
    >
      Delete
    </p>
  );
};

export default DeleteButton;