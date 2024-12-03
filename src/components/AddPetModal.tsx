import React, { useState } from 'react';

interface AddPetModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddPetModal: React.FC<AddPetModalProps> = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [race, setRace] = useState('');
    const [birthday, setBirthday] = useState('');
    const [weight, setWeight] = useState('');
    const [color, setColor] = useState('');
    const [currentState, setCurrentState] = useState('');

    const handleSubmit = () => {
        // Handle form submission
        console.log({ name, race, birthday, weight, color, currentState });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
                <h2 className="text-2xl font-bold text-primary-800 mb-6">Add New Pet</h2>
                <div className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                    />
                    <input 
                        type="text" 
                        placeholder="Race" 
                        value={race} 
                        onChange={(e) => setRace(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                    />
                    <input 
                        type="date" 
                        placeholder="Birthday" 
                        value={birthday} 
                        onChange={(e) => setBirthday(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                    />
                    <input 
                        type="text" 
                        placeholder="Weight" 
                        value={weight} 
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                    />
                    <input 
                        type="text" 
                        placeholder="Color" 
                        value={color} 
                        onChange={(e) => setColor(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                    />
                    <input 
                        type="text" 
                        placeholder="Current State" 
                        value={currentState} 
                        onChange={(e) => setCurrentState(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                    />
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                        Add Pet
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddPetModal;