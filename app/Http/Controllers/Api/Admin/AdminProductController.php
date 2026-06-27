<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class AdminProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $products = Product::with('seller:id,name')
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate(50);

        return response()->json([
            'data' => $products->map(fn($p) => [
                'id'     => $p->id,
                'title'  => $p->title,
                'price'  => $p->price,
                'status' => $p->status,
                'seller' => $p->seller ? ['id' => $p->seller->id, 'name' => $p->seller->name] : null,
            ]),
        ]);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $product = Product::query()->withTrashed()->findOrFail($id);

        $data = $request->validate([
            'status' => ['required', 'string', Rule::in(['draft', 'published', 'sold', 'inactive'])],
        ]);

        $product->forceFill(['status' => $data['status']])->save();

        return response()->json([
            'product' => ['id' => $product->id, 'status' => $product->status],
            'message' => __('Statut produit mis à jour.'),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $product = Product::query()->withTrashed()->findOrFail($id);

        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        foreach ($product->images ?? [] as $path) {
            Storage::disk('public')->delete($path);
        }

        $product->forceDelete();

        return response()->json(['message' => __('Produit supprimé définitivement.')]);
    }
}
