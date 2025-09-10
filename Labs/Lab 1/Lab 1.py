import random
import time
import matplotlib.pyplot as plt
import numpy as np

# Global variable to track comparisons
comparisons = 0

def generateRandomArray(size: int, maxVal: int) -> list[int]:
    """Generate an array of random integers in range [1, maxVal]"""
    return [random.randint(1, maxVal) for _ in range(size)]

def insertionSort(arr: list[int], left: int, right: int) -> None:
    """Insertion sort for small subarrays"""
    global comparisons
    
    for i in range(left + 1, right + 1):
        key = arr[i]
        j = i - 1
        
        # Move elements greater than key one position ahead
        while j >= left:
            comparisons += 1
            if arr[j] <= key:
                break
            arr[j + 1] = arr[j]
            j -= 1
            
        arr[j + 1] = key

def merge(arr: list[int], left: int, mid: int, right: int) -> None:
    """Merge two sorted subarrays"""
    global comparisons
    
    # Create temporary arrays for left and right subarrays
    left_arr = arr[left:mid + 1]
    right_arr = arr[mid + 1:right + 1]
    
    # Merge the temporary arrays back into arr[left..right]
    i = j = 0  # Initial indexes of left and right subarrays
    k = left   # Initial index of merged subarray
    
    while i < len(left_arr) and j < len(right_arr):
        comparisons += 1
        if left_arr[i] <= right_arr[j]:
            arr[k] = left_arr[i]
            i += 1
        else:
            arr[k] = right_arr[j]
            j += 1
        k += 1
    
    # Copy remaining elements of left_arr, if any
    while i < len(left_arr):
        arr[k] = left_arr[i]
        i += 1
        k += 1
    
    # Copy remaining elements of right_arr, if any
    while j < len(right_arr):
        arr[k] = right_arr[j]
        j += 1
        k += 1

def hybridSort(arr: list[int], left: int, right: int, s: int) -> None:
    """Hybrid sorting algorithm that uses insertion sort for small arrays"""
    if left < right:
        # If subarray size is small (≤ s), use insertion sort
        if right - left + 1 <= s:
            insertionSort(arr, left, right)
        else:
            # Otherwise, use merge sort
            mid = left + (right - left) // 2
            
            # Recursively sort both halves
            hybridSort(arr, left, mid, s)
            hybridSort(arr, mid + 1, right, s)
            
            # Merge the sorted halves
            merge(arr, left, mid, right)

def mergeSort(arr: list[int], left: int, right: int) -> None:
    """Original merge sort implementation for comparison"""
    global comparisons
    
    if left < right:
        mid = left + (right - left) // 2
        
        # Recursively sort both halves
        mergeSort(arr, left, mid)
        mergeSort(arr, mid + 1, right)
        
        # Merge the sorted halves
        merge(arr, left, mid, right)

def resetComparisons():
    """Reset the global comparisons counter"""
    global comparisons
    comparisons = 0

def runExperiment(arr: list[int], algorithm: str, s: int = None) -> tuple[int, float]:
    """Run sorting experiment and return (comparisons, time_taken)"""
    arr_copy = arr.copy()
    resetComparisons()
    
    start_time = time.perf_counter()
    
    if algorithm == "hybrid":
        hybridSort(arr_copy, 0, len(arr_copy) - 1, s)
    elif algorithm == "mergesort":
        mergeSort(arr_copy, 0, len(arr_copy) - 1)
    
    end_time = time.perf_counter()
    
    return comparisons, end_time - start_time

def analyzeFixedS():
    """Part (c)(i): Analyze with fixed S, varying input sizes"""
    print("=== Analysis with Fixed S (S=10), Varying Input Sizes ===")
    
    sizes = [1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000]
    s_value = 10
    max_val = 1000000
    
    size_results = []
    comparison_results = []
    time_results = []
    
    for size in sizes:
        print(f"Testing size: {size}")
        arr = generateRandomArray(size, max_val)
        
        comparisons_made, time_taken = runExperiment(arr, "hybrid", s_value)
        
        size_results.append(size)
        comparison_results.append(comparisons_made)
        time_results.append(time_taken)
        
        print(f"  Comparisons: {comparisons_made}, Time: {time_taken:.6f}s")
    
    # Plot results
    plt.figure(figsize=(12, 5))
    
    plt.subplot(1, 2, 1)
    plt.plot(size_results, comparison_results, 'bo-', linewidth=2, markersize=8)
    plt.xlabel('Input Size (n)')
    plt.ylabel('Number of Comparisons')
    plt.title(f'Comparisons vs Input Size (S={s_value})')
    plt.grid(True, alpha=0.3)
    
    # Theoretical O(n log n) comparison
    theoretical = [n * np.log2(n) * 0.8 for n in size_results]
    plt.plot(size_results, theoretical, 'r--', linewidth=2, label='Theoretical O(n log n)')
    plt.legend()
    
    plt.subplot(1, 2, 2)
    plt.plot(size_results, time_results, 'go-', linewidth=2, markersize=8)
    plt.xlabel('Input Size (n)')
    plt.ylabel('Time (seconds)')
    plt.title(f'Time vs Input Size (S={s_value})')
    plt.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.show()
    
    return size_results, comparison_results, time_results

def analyzeFixedN():
    """Part (c)(ii): Analyze with fixed input size, varying S values"""
    print("=== Analysis with Fixed Input Size (n=50000), Varying S Values ===")
    
    n_fixed = 50000
    s_values = list(range(1, 51, 2))  # S from 1 to 50, step 2
    max_val = 1000000
    
    # Generate the same array for consistent comparison
    arr = generateRandomArray(n_fixed, max_val)
    
    s_results = []
    comparison_results = []
    time_results = []
    
    for s in s_values:
        print(f"Testing S: {s}")
        
        comparisons_made, time_taken = runExperiment(arr, "hybrid", s)
        
        s_results.append(s)
        comparison_results.append(comparisons_made)
        time_results.append(time_taken)
        
        print(f"  Comparisons: {comparisons_made}, Time: {time_taken:.6f}s")
    
    # Plot results
    plt.figure(figsize=(12, 5))
    
    plt.subplot(1, 2, 1)
    plt.plot(s_results, comparison_results, 'bo-', linewidth=2, markersize=6)
    plt.xlabel('Threshold Value (S)')
    plt.ylabel('Number of Comparisons')
    plt.title(f'Comparisons vs Threshold S (n={n_fixed})')
    plt.grid(True, alpha=0.3)
    
    plt.subplot(1, 2, 2)
    plt.plot(s_results, time_results, 'go-', linewidth=2, markersize=6)
    plt.xlabel('Threshold Value (S)')
    plt.ylabel('Time (seconds)')
    plt.title(f'Time vs Threshold S (n={n_fixed})')
    plt.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.show()
    
    # Find optimal S
    min_time_idx = time_results.index(min(time_results))
    optimal_s = s_results[min_time_idx]
    print(f"Optimal S based on minimum time: {optimal_s}")
    
    return s_results, comparison_results, time_results, optimal_s

def findOptimalS():
    """Part (c)(iii): Find optimal S for different input sizes"""
    print("=== Finding Optimal S for Different Input Sizes ===")
    
    sizes = [5000, 10000, 20000, 50000, 100000]
    s_range = list(range(5, 101, 5))  # S from 5 to 100, step 5
    max_val = 1000000
    
    optimal_s_values = []
    
    for size in sizes:
        print(f"Finding optimal S for size: {size}")
        arr = generateRandomArray(size, max_val)
        
        best_time = float('inf')
        best_s = None
        
        for s in s_range:
            _, time_taken = runExperiment(arr, "hybrid", s)
            
            if time_taken < best_time:
                best_time = time_taken
                best_s = s
        
        optimal_s_values.append(best_s)
        print(f"  Optimal S: {best_s}, Best time: {best_time:.6f}s")
    
    # Plot optimal S vs input size
    plt.figure(figsize=(8, 6))
    plt.plot(sizes, optimal_s_values, 'ro-', linewidth=2, markersize=8)
    plt.xlabel('Input Size (n)')
    plt.ylabel('Optimal Threshold (S)')
    plt.title('Optimal S vs Input Size')
    plt.grid(True, alpha=0.3)
    plt.show()
    
    return sizes, optimal_s_values

def compareWithMergeSort(optimal_s: int):
    """Part (d): Compare hybrid sort with original merge sort"""
    print("=== Comparison with Original Merge Sort (n=10M) ===")
    
    size = 10000000  # 10 million
    max_val = 1000000
    
    print(f"Generating array of size {size:,}...")
    arr = generateRandomArray(size, max_val)
    
    # Test hybrid sort
    print("Running Hybrid Sort...")
    hybrid_comparisons, hybrid_time = runExperiment(arr, "hybrid", optimal_s)
    
    # Test original merge sort
    print("Running Original Merge Sort...")
    merge_comparisons, merge_time = runExperiment(arr, "mergesort")
    
    # Results
    print("\n=== RESULTS ===")
    print(f"Hybrid Sort (S={optimal_s}):")
    print(f"  Comparisons: {hybrid_comparisons:,}")
    print(f"  Time: {hybrid_time:.6f} seconds")
    
    print(f"\nOriginal Merge Sort:")
    print(f"  Comparisons: {merge_comparisons:,}")
    print(f"  Time: {merge_time:.6f} seconds")
    
    print(f"\nImprovement:")
    comp_improvement = ((merge_comparisons - hybrid_comparisons) / merge_comparisons) * 100
    time_improvement = ((merge_time - hybrid_time) / merge_time) * 100
    print(f"  Comparisons reduced by: {comp_improvement:.2f}%")
    print(f"  Time reduced by: {time_improvement:.2f}%")
    
    return hybrid_comparisons, hybrid_time, merge_comparisons, merge_time

def main():
    """Main function to run all experiments"""
    print("ALGORITHM DESIGN AND ANALYSIS - Project 1")
    print("Hybrid Sorting Algorithm Analysis")
    print("=" * 50)
    
    # Set random seed for reproducibility
    random.seed(42)
    
    try:
        # Part (c)(i): Fixed S, varying input sizes
        print("\n1. Running analysis with fixed S...")
        analyzeFixedS()
        
        # Part (c)(ii): Fixed input size, varying S
        print("\n2. Running analysis with fixed input size...")
        _, _, _, optimal_s = analyzeFixedN()
        
        # Part (c)(iii): Find optimal S for different sizes
        print("\n3. Finding optimal S for different input sizes...")
        findOptimalS()
        
        # Part (d): Compare with original merge sort
        print("\n4. Comparing with original merge sort...")
        compareWithMergeSort(optimal_s)
        
        print("\nAll experiments completed successfully!")
        
    except Exception as e:
        print(f"An error occurred: {e}")
        import traceback
        traceback.print_exc()

# Simple test function for basic functionality
def simpleTest():
    """Simple test to verify the algorithm works correctly"""
    print("=== Simple Test ===")
    
    # Test with small array
    test_arr = [64, 34, 25, 12, 22, 11, 90, 5]
    print(f"Original array: {test_arr}")
    
    resetComparisons()
    hybridSort(test_arr, 0, len(test_arr) - 1, 3)
    
    print(f"Sorted array: {test_arr}")
    print(f"Comparisons made: {comparisons}")
    print(f"Is sorted correctly: {test_arr == sorted([64, 34, 25, 12, 22, 11, 90, 5])}")

if __name__ == "__main__":
    # Uncomment the line below to run a simple test first
    # simpleTest()
    
    # Run the full analysis
    main()