"use client";

import { useRouter } from 'next/navigation'; // Use next/navigation for client-side routing
import React from 'react';

const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL as string 
interface DeleteButtonProps {
  slug: string;
//  onDeleteSuccess: () => void; // Optional: callback for when deletion is successful
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
      // 2. Make the API call to delete the post
      const response = await fetch(API_URL, { // Assuming your delete API endpoint is /api/posts/[slug]
        method: 'DELETE',
      });

      if (!response.ok) {
        // Handle non-OK responses (e.g., 404, 500)
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete post');
      }

      // 3. Post was successfully deleted
      alert('Post deleted successfully!');
//      onDeleteSuccess(); // Call the success callback

      // 4. Redirect the user (e.g., to a blog list page or home)
      router.push('/'); // Change '/blog' to your desired redirect path
      router.refresh(); // Refresh the data on the destination page

    } catch (error: any) {
      console.error('Error deleting post:', error);
      alert(`Error deleting post: ${error.message || 'An unexpected error occurred.'}`);
    }
      
  };

  return (
    <p
      onClick={handleDelete} // Now onClick is inside a Client Component
      className="text-sm border border-gray-100 px-2 py-1 rounded-lg cursor-pointer text-gray-100 bg-red-800 hover:bg-red-900 hover:text-gray-300 grid"
    >
      Delete
    </p>
  );
};

export default DeleteButton;