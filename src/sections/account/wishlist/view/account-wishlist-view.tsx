'use client';

import { doc, getDoc } from 'firebase/firestore';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useUserProfile, useUserProfileMutations } from 'src/hooks/firebase';

import { fCurrency } from 'src/utils/format-number';

import { FIRESTORE } from 'src/lib/firebase';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type WishlistProduct = {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image?: string;
  isActive: boolean;
  stock: number;
};

// ----------------------------------------------------------------------

export function AccountWishlistView() {
  const { profile, loading: profileLoading, refetch } = useUserProfile();
  const { removeFromWishlist, loading: mutating } = useUserProfileMutations();
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const wishlistIds = useMemo(() => profile?.wishlist || [], [profile?.wishlist]);

  const fetchWishlistProducts = useCallback(async () => {
    if (wishlistIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const productPromises = wishlistIds.map(async (id) => {
        const docRef = doc(FIRESTORE, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            name: data.name,
            price: data.price,
            compareAtPrice: data.compareAtPrice,
            image: data.images?.[0]?.url,
            isActive: data.isActive,
            stock: data.stock,
          } as WishlistProduct;
        }
        return null;
      });

      const results = await Promise.all(productPromises);
      setProducts(results.filter((p): p is WishlistProduct => p !== null));
    } catch (error) {
      console.error('Error fetching wishlist products:', error);
    } finally {
      setLoading(false);
    }
  }, [wishlistIds]);

  useEffect(() => {
    if (!profileLoading) {
      fetchWishlistProducts();
    }
  }, [profileLoading, fetchWishlistProducts]);

  const handleRemove = useCallback(async (productId: string) => {
    const success = await removeFromWishlist(productId);
    if (success) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      refetch();
    }
  }, [removeFromWishlist, refetch]);

  if (profileLoading || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        My Wishlist
      </Typography>

      {products.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Your wishlist is empty.
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            Save items you love for later!
          </Typography>

          <Button
            component={RouterLink}
            href={paths.products}
            variant="contained"
            sx={{ mt: 3 }}
          >
            Start Shopping
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card variant="outlined">
                <Box
                  sx={{
                    position: 'relative',
                    pt: '100%',
                    backgroundColor: 'grey.100',
                  }}
                >
                  <Box
                    component="img"
                    src={product.image || '/assets/placeholder.svg'}
                    alt={product.name}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'background.paper',
                      '&:hover': { bgcolor: 'background.paper' },
                    }}
                    onClick={() => handleRemove(product.id)}
                    disabled={mutating}
                  >
                    <Iconify icon="solar:heart-bold" sx={{ color: 'error.main' }} />
                  </IconButton>
                </Box>

                <CardContent>
                  <Typography variant="subtitle2" noWrap>
                    {product.name}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Typography variant="subtitle1">{fCurrency(product.price)}</Typography>
                    {product.compareAtPrice && (
                      <Typography
                        variant="body2"
                        sx={{ textDecoration: 'line-through', color: 'text.disabled' }}
                      >
                        {fCurrency(product.compareAtPrice)}
                      </Typography>
                    )}
                  </Box>

                  {!product.isActive || product.stock === 0 ? (
                    <Typography variant="caption" sx={{ color: 'error.main' }}>
                      Out of stock
                    </Typography>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      size="small"
                      sx={{ mt: 2 }}
                    >
                      Add to Cart
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Card>
  );
}
