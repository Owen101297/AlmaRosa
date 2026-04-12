import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useAddresses } from "@/hooks/useAddresses";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, MapPin, Package, LogOut, Edit, Trash2 } from "lucide-react";

export default function Account() {
  const [, setLocation] = useLocation();
  const {
    user,
    profile,
    isLoading: authLoading,
    signOut,
    updateProfile,
  } = useAuth();
  const { addresses, deleteAddress, fetchAddresses } = useAddresses();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/login?redirect=/cuenta");
    }
  }, [authLoading, user, setLocation]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile({ full_name: fullName, phone });
    setIsEditingProfile(false);
    setIsSaving(false);
  };

  const handleDeleteAddress = async (id: number) => {
    if (confirm("¿Estás segur@ de eliminar esta dirección?")) {
      await deleteAddress(id);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setLocation("/");
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <p className="text-center text-muted-foreground">Cargando...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-destructive/10 pt-24 pb-12 border-b border-destructive/20">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground">
            Mi Cuenta
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestiona tu información personal
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información Personal
                </CardTitle>
                <CardDescription>
                  Actualiza tu información de perfil
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEditingProfile ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Nombre completo</Label>
                        <Input
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="5512345678"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={user?.email || ""} disabled />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? "Guardando..." : "Guardar cambios"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditingProfile(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">
                          {profile?.full_name || "Sin nombre"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user?.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {profile?.phone || "Sin teléfono"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditingProfile(true)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Direcciones Guardadas
                </CardTitle>
                <CardDescription>
                  Gestiona tus direcciones de entrega
                </CardDescription>
              </CardHeader>
              <CardContent>
                {addresses.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No tienes direcciones guardadas.
                    <br />
                    Agrega una en tu próximo pedido.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="flex items-start justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{addr.full_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {addr.street}, {addr.city}, {addr.state}{" "}
                            {addr.zip_code}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {addr.phone}
                          </p>
                          {addr.is_default && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded mt-2 inline-block">
                              Principal
                            </span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAddress(addr.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/pedidos" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="w-4 h-4 mr-2" />
                    Mis pedidos
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar sesión
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
