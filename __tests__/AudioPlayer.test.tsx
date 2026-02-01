import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AudioPlayer from '../components/AudioPlayer';
import { Station } from '../types';

// Mock station data
const mockStation: Station = {
  changeuuid: 'test-change-uuid',
  stationuuid: 'test-station-uuid',
  name: 'Test Radio Station',
  url: 'https://example.com/stream',
  url_resolved: 'https://example.com/stream',
  homepage: 'https://example.com',
  favicon: 'https://example.com/favicon.ico',
  tags: 'pop,rock,test',
  country: 'Test Country',
  countrycode: 'TC',
  state: 'Test State',
  language: 'English',
  votes: 100,
  clickcount: 1000,
  codec: 'MP3',
  bitrate: 128,
  geo_lat: 0,
  geo_long: 0,
  is_approximate: false
};

describe('AudioPlayer Component', () => {
  const mockProps = {
    station: mockStation,
    isPlaying: false,
    volume: 0.8,
    onTogglePlay: jest.fn(),
    onVolumeChange: jest.fn(),
    onExploreClick: jest.fn(),
    isFavorite: false,
    onToggleFavorite: jest.fn(),
    theme: 'dark' as const
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders placeholder when no station is selected', () => {
    render(<AudioPlayer {...mockProps} station={null} />);
    expect(screen.getByText('Ready to Explore')).toBeInTheDocument();
  });

  test('renders station information correctly', () => {
    render(<AudioPlayer {...mockProps} />);
    expect(screen.getByText('Test Radio Station')).toBeInTheDocument();
    expect(screen.getByText('Test Country')).toBeInTheDocument();
    expect(screen.getByText('128 KBPS')).toBeInTheDocument();
  });

  test('renders audio element', () => {
    const { container } = render(<AudioPlayer {...mockProps} />);
    const audioElement = container.querySelector('audio');
    expect(audioElement).toBeInTheDocument();
    expect(audioElement).toHaveAttribute('crossOrigin', 'anonymous');
  });

  test('calls onTogglePlay when play button is clicked', () => {
    render(<AudioPlayer {...mockProps} />);
    const playButton = screen.getByRole('button', { name: /play|pause/i });
    fireEvent.click(playButton);
    expect(mockProps.onTogglePlay).toHaveBeenCalledTimes(1);
  });

  test('calls onToggleFavorite when heart button is clicked', () => {
    render(<AudioPlayer {...mockProps} />);
    const favoriteButton = screen.getAllByRole('button')[1]; // Second button is favorite
    fireEvent.click(favoriteButton);
    expect(mockProps.onToggleFavorite).toHaveBeenCalledTimes(1);
  });

  test('shows favorite state correctly', () => {
    const { rerender } = render(<AudioPlayer {...mockProps} isFavorite={false} />);
    let heartIcon = screen.getAllByRole('button')[1].querySelector('svg');
    expect(heartIcon).not.toHaveAttribute('fill', 'currentColor');

    rerender(<AudioPlayer {...mockProps} isFavorite={true} />);
    heartIcon = screen.getAllByRole('button')[1].querySelector('svg');
    expect(heartIcon).toHaveAttribute('fill', 'currentColor');
  });

  test('displays tags correctly', () => {
    render(<AudioPlayer {...mockProps} />);
    expect(screen.getByText('#pop')).toBeInTheDocument();
    expect(screen.getByText('#rock')).toBeInTheDocument();
    expect(screen.getByText('#test')).toBeInTheDocument();
  });

  test('handles theme prop correctly', () => {
    const { container, rerender } = render(<AudioPlayer {...mockProps} theme="dark" />);
    let card = container.querySelector('.bg-black\\/80');
    expect(card).toBeInTheDocument();

    rerender(<AudioPlayer {...mockProps} theme="light" />);
    // Light theme would have different classes
  });

  test('shows loading state', () => {
    render(<AudioPlayer {...mockProps} />);
    // Simulate loading by checking for loader icon
    // This would require mocking the audio loading state
  });

  test('handles share button click', async () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined)
      }
    });

    render(<AudioPlayer {...mockProps} />);
    const shareButton = screen.getAllByRole('button')[2]; // Third button is share
    fireEvent.click(shareButton);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });
  });
});
